import React, { useState } from "react";
import { Box, Stepper, Step, StepLabel, Button, Alert, Typography, Paper, Chip } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import ShoeInfoStep from "./ShoeInfoStep";
import ImageUploadStep from "./ImageUploadStep";
import ConfirmationStep from "./ConfirmStep";
import TimelineCarousel from "./TimelineCarousel";
import ShoeAnimation from "./ShoeAnimation";
import { useParams } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import NotAcceptingContracts from "../../components/NotAcceptingContracts";
import { LoadingCircle } from "../../components/LoadingCircle";

const CREATE_CONTRACT = gql`
  mutation createContract($data: CreateContractInput!) {
    createContract(data: $data) {
      id
    }
  }
`;

const GET_MEMBER_CONTRACT_STATUS = gql`
  query GetMemberContractStatus($memberId: ID!) {
    member(id: $memberId) {
      contractsDisabled
    }
  }
`;

const GET_SERVICE_MENU = gql`
  query GetServiceMenu($memberId: ID!) {
    getServiceMenu(memberId: $memberId) {
      id
      name
      price
      description
      isActive
      sortOrder
    }
  }
`;

function buildShoeInfoSchema(requireNotes) {
  return Yup.object().shape({
    declaredMarketValue: Yup.number()
      .typeError("Must be a number")
      .required("Declared market value is required")
      .positive("Must be a positive number"),
    shoeDetails: Yup.object().shape({
      brand: Yup.string().required("Brand is required"),
      model: Yup.string().required("Model is required"),
      color: Yup.string().required("Color is required"),
      material: Yup.string().required("Material is required"),
      size: Yup.string().required("Size is required"),
      soleCondition: Yup.string().required("Sole condition is required"),
      previousRepairsNotes: Yup.string().when("previousRepairs", {
        is: true,
        then: (schema) => schema.required("Please describe the previous repairs"),
      }),
      clientNotes: requireNotes
        ? Yup.string().required("Please explain your repair request")
        : Yup.string().notRequired(),
    }),
  });
}

const initialValues = {
  declaredMarketValue: "2900",
  boxIncluded: true,
  shoeDetails: {
    brand: "nike",
    model: "Air Force 1",
    color: "White",
    material: "Leather",
    size: "10.5",
    soleCondition: "light wear",
    year: "2022",
    returnTimeframe: "standard",
    odorLevel: "none",
    previousRepairs: false,
    previousRepairsNotes: "",
    clientNotes: "Deep clean and restore original white finish. Light yellowing on soles, minor creasing on toe box. Please also condition the leather.",
    photos: {
      leftSide: [],
      rightSide: [],
      topView: [],
      bottomView: [],
      frontView: [],
      backView: [],
      inside: [],
      tongue: [],
      box: [],
      other: [],
    },
  },
};

function IntakeServiceCard({ item, selected, onSelect, isCustom, fullWidth }) {
  const isSelected = selected;
  return (
    <Paper
      variant="outlined"
      onClick={onSelect}
      sx={{
        p: 2,
        borderRadius: 2,
        cursor: "pointer",
        borderColor: isSelected ? "primary.main" : "divider",
        borderWidth: isSelected ? 2 : 1,
        bgcolor: isSelected ? "rgba(255,195,28,0.06)" : "background.paper",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        minHeight: isCustom ? "auto" : 110,
        gridColumn: isCustom || fullWidth ? { xs: "span 1", md: "span 2" } : "auto",
        transition: "all 0.15s",
        "&:hover": { borderColor: isSelected ? "primary.main" : "text.secondary" },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
        <Typography fontWeight={700} sx={{ fontSize: "0.95rem" }}>
          {item.name}
        </Typography>
        {!isCustom && <Chip label={`$${item.price}`} size="small" sx={{ fontWeight: 700 }} />}
        {isCustom && <Chip label="Custom" size="small" variant="outlined" />}
      </Box>
      {item.description ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.4 }}
        >
          {item.description}
        </Typography>
      ) : isCustom ? (
        <Typography variant="body2" color="text.secondary">
          Describe your repair — member will price it.
        </Typography>
      ) : null}
      {isSelected && !isCustom && (
        <Typography variant="caption" color="text.secondary">
          Price hint: ${item.price} — member retains final price authority.
        </Typography>
      )}
    </Paper>
  );
}

function ServiceSelectionStep({ activeItems, selectedServiceId, setSelectedServiceId, selectedItem }) {
  const isSingle = activeItems.length === 1;
  return (
    <Box>
      <Box textAlign="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Select a Service
        </Typography>
        <Typography variant="body1" color="text.secondary" mt={0.5}>
          Choose a service or request something custom
        </Typography>
      </Box>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={600} mb={1.5}>
          Available Services
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: isSingle ? "1fr" : { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 1.5 }}>
          {activeItems.map((item) => (
            <IntakeServiceCard
              key={item.id}
              item={item}
              selected={selectedServiceId === item.id}
              onSelect={() => setSelectedServiceId(item.id)}
              isCustom={false}
              fullWidth={isSingle}
            />
          ))}
          <IntakeServiceCard
            item={{ name: "Custom Request", description: "Describe your repair — member will price it." }}
            selected={selectedServiceId === "__custom"}
            onSelect={() => setSelectedServiceId("__custom")}
            isCustom
          />
        </Box>
        {selectedItem && (
          <Typography variant="body2" color="text.secondary" mt={1.5}>
            Selected: {selectedItem.name} — price hint ${selectedItem.price}. Member retains final price authority.
          </Typography>
        )}
        {selectedServiceId === "__custom" && (
          <Typography variant="body2" color="text.secondary" mt={1.5}>
            Describe your custom request in the next step.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export const ContractForm = ({ isPreview = false, memberId: memberIdProp }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState("__custom");
  const { memberId: memberIdParam } = useParams();

  const [createContract] = useMutation(CREATE_CONTRACT);

  const memberId = isPreview ? memberIdProp : memberIdParam;

  const {
    loading: statusLoading,
    error: statusError,
    data: statusData,
  } = useQuery(GET_MEMBER_CONTRACT_STATUS, {
    variables: { memberId },
    skip: isPreview,
  });

  const {
    data: menuData,
    error: menuError,
  } = useQuery(GET_SERVICE_MENU, {
    variables: { memberId },
    skip: !memberId,
  });

  const serviceMenu = menuData?.getServiceMenu || [];
  const activeItems = serviceMenu.filter((i) => i.isActive);
  const hasMenu = !menuError && activeItems.length > 0;
  const selectedItem = activeItems.find((i) => i.id === selectedServiceId) || null;

  const steps = hasMenu
    ? ["Select Service", "Shoe Information", "Image Upload", "Confirmation"]
    : ["Shoe Information", "Image Upload", "Confirmation"];

  const requireNotes = !hasMenu || selectedServiceId === "__custom";
  const shoeInfoSchema = buildShoeInfoSchema(requireNotes);

  const validationSchemas = hasMenu
    ? [Yup.object().shape({}), shoeInfoSchema]
    : [shoeInfoSchema];

  const handleNext = (values, { setTouched, setSubmitting }) => {
    setTouched({});
    setSubmitting(false);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  if (isPreview && !memberIdProp) return <div>Unauthorized preview access</div>;

  if (showIntro) {
    return (
      <Box sx={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", px: { xs: 2, sm: 4 } }}>
        <Paper variant="outlined" sx={{ p: 5, maxWidth: 640, textAlign: "center" }}>
          <ShoeAnimation isPreview={isPreview} />
          <Typography variant="h3" fontWeight={700} mb={1}>
            Start Your Request
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Tell us about your sneakers, upload photos, describe what you want done, and we'll take it from there.
          </Typography>
          <Box sx={{ width: "100%", mb: 4, mt: 5 }}>
            <TimelineCarousel />
          </Box>
          <Box sx={{ mt: 5 }} />
          <Button variant="contained" color="primary" size="large" onClick={() => setShowIntro(false)}>
            Get Started
          </Button>
        </Paper>
      </Box>
    );
  }

  if (!isPreview) {
    if (statusLoading) return <LoadingCircle />;
    if (statusError) return <div>Error: {statusError.message}</div>;
    if (statusData?.member?.contractsDisabled) return <NotAcceptingContracts />;
  };

  const handleSubmit = async (values) => {
    const {
      brand,
      model,
      material,
      color,
      size,
      soleCondition,
      year,
      returnTimeframe,
      odorLevel,
      previousRepairs,
      previousRepairsNotes,
      clientNotes,
      photos,
    } = values.shoeDetails;

    const selectedServiceMenuItem =
      hasMenu && selectedItem
        ? { id: selectedItem.id, name: selectedItem.name, price: selectedItem.price }
        : null;

    await createContract({
      variables: {
        data: {
          memberId,
          declaredMarketValue: parseFloat(values.declaredMarketValue),
          boxIncluded: values.boxIncluded,
          repairDetails: {
            clientNotes,
          },
          shoeDetails: {
            brand,
            model,
            color,
            size,
            soleCondition,
            material,
            year,
            returnTimeframe,
            odorLevel,
            previousRepairs,
            previousRepairsNotes,
            photos: photos,
          },
          ...(selectedServiceMenuItem ? { selectedServiceMenuItem } : {}),
        },
      },
    });
  };

  const getStepContent = (step, formik) => {
    if (hasMenu) {
      switch (step) {
        case 0:
          return (
            <ServiceSelectionStep
              activeItems={activeItems}
              selectedServiceId={selectedServiceId}
              setSelectedServiceId={setSelectedServiceId}
              selectedItem={selectedItem}
            />
          );
        case 1:
          return <ShoeInfoStep formik={formik} showClientNotes={selectedServiceId === "__custom"} selectedItem={selectedItem} />;
        case 2:
          return <ImageUploadStep formik={formik} />;
        case 3:
          return <ConfirmationStep formik={formik} />;
        default:
          return "Unknown step";
      }
    }
    switch (step) {
      case 0:
        return <ShoeInfoStep formik={formik} showClientNotes={true} selectedItem={null} />;
      case 1:
        return <ImageUploadStep formik={formik} />;
      case 2:
        return <ConfirmationStep formik={formik} />;
      default:
        return "Unknown step";
    }
  };

  const isNextDisabled = (formik) => {
    if (formik.isSubmitting) return true;
    if (isPreview && activeStep === steps.length - 1) return true;
    if (hasMenu && activeStep === 0 && !selectedServiceId) return true;
    return false;
  };

  return (
    <Box sx={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
      {isPreview && (
        <Alert severity="warning" sx={{ mx: { xs: 2, sm: 4 }, mt: 2, fontWeight: "bold", fontSize: "1rem" }}>
          DRAFT PREVIEW — This form is in preview mode. No data will be submitted.
        </Alert>
      )}
      <Stepper sx={{ px: { xs: 2, sm: 4 }, pt: 2 }} activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ flex: 1, overflowY: "auto", px: { xs: 2, sm: 4 }, mt: 4 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchemas[activeStep]}
          onSubmit={activeStep === steps.length - 1 ? handleSubmit : handleNext}
        >
          {(formik) => (
            <Form style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
              <Box sx={{ flex: 1 }}>
                {getStepContent(activeStep, formik)}
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ py: 2, mt: 4, borderTop: 1, borderColor: "divider", bgcolor: "background.default" }}
              >
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isNextDisabled(formik)}
                  >
                    {activeStep === steps.length - 1 ? "Submit" : "Next"}
                  </Button>
                  {isPreview && activeStep === steps.length - 1 && (
                    <Typography variant="body2" sx={{ color: "text.secondary", mt: 1, fontStyle: "italic" }}>
                      This is a preview — you cannot submit
                    </Typography>
                  )}
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};
