import React, { useState } from "react";
import { Box, Stepper, Step, StepLabel, Button, Alert, Typography, Paper, Chip, Avatar } from "@mui/material";
import { FiInfo, FiArrowRight, FiStar } from "react-icons/fi";
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
    memberById(id: $memberId) {
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

const GET_MEMBER_FOR_CUSTOM = gql`
  query GetMemberForCustom($memberId: ID!) {
    memberById(id: $memberId) {
      id
      firstName
      lastName
      businessName
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
      <Box display="flex" justifyContent="space-between" alignItems="center" gap={1} sx={{ minHeight: 38 }}>
        <Typography fontWeight={800} sx={{ fontSize: "1.35rem", lineHeight: 1.2 }}>
          {item.name}
        </Typography>
        {!isCustom ? (
          <Box display="flex" flexDirection="column" alignItems="center" gap={0.75}>
            <Chip label={`$${item.price}`} sx={{ fontWeight: 800, fontSize: "1.35rem", bgcolor: "#FFD100", color: "#000", px: 2.5, height: 34, minWidth: 84, "& .MuiChip-label": { px: 1.2, lineHeight: 1 } }} />
            <Typography variant="caption" sx={{ fontSize: "0.68rem", color: "text.secondary", opacity: 0.65, lineHeight: 1, textAlign: "center", letterSpacing: "0.02em", mt: 0.25 }}>
              plus taxes and shipping
            </Typography>
          </Box>
        ) : (
          <Chip label="Custom" size="small" variant="outlined" />
        )}
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
          Don’t see what you need? Submit a custom request.
        </Typography>
      ) : null}
    </Paper>
  );
}

function ServiceSelectionStep({ activeItems, selectedServiceId, setSelectedServiceId, selectedItem, member }) {
  const isSingle = activeItems.length === 1;
  const memberName = member?.firstName || member?.businessName || "your member";
  const initials = ((member?.firstName?.[0] || member?.businessName?.[0] || "M") + (member?.lastName?.[0] || "")).toUpperCase().slice(0, 2);
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
        </Box>
        {selectedItem && (
          <Box display="flex" alignItems="center" gap={0.75} sx={{ mt: 1.5, px: 1.25, py: 1, borderRadius: 1.5, bgcolor: "rgba(255,195,28,0.08)", border: "1px solid rgba(255,195,28,0.25)" }}>
            <FiInfo size={13} style={{ flexShrink: 0, color: "#E6BC00" }} />
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500, lineHeight: 1.4 }}>
              Estimate — {selectedItem.name} starting at <strong>${selectedItem.price}</strong>. Final price may be higher or lower after member review.
            </Typography>
          </Box>
        )}
      </Paper>
      <Paper
        variant="outlined"
        onClick={() => setSelectedServiceId("__custom")}
        sx={{
          p: 2.5,
          mt: 2,
          cursor: "pointer",
          borderStyle: selectedServiceId === "__custom" ? "solid" : "dashed",
          borderColor: selectedServiceId === "__custom" ? "primary.main" : "divider",
          borderWidth: selectedServiceId === "__custom" ? 2 : 1,
          bgcolor: selectedServiceId === "__custom" ? "rgba(255,195,28,0.12)" : "transparent",
          background: selectedServiceId === "__custom" ? "linear-gradient(135deg, rgba(255,209,0,0.12), transparent)" : "transparent",
          boxShadow: selectedServiceId === "__custom" ? "0 2px 12px rgba(255,209,0,0.15)" : "none",
          "&:hover": { borderColor: "primary.main", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" },
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ width: 52, height: 52, bgcolor: "#FFD100", color: "#000", fontWeight: 800, flexShrink: 0, border: "2px solid #E6BC00", boxShadow: "0 2px 8px rgba(255,209,0,0.3)" }}>{initials}</Avatar>
          <Box flex={1} textAlign="left">
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mb={0.25}>
              <FiStar size={16} style={{ color: "#FFD100", flexShrink: 0 }} />
              <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2, fontSize: "1.1rem" }}>
                Want something unique?
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ lineHeight: 1.4, fontWeight: 600, color: "text.primary" }}>
              {memberName} will build your <Box component="span" sx={{ color: "#E6BC00", fontWeight: 800 }}>custom quote — fast.</Box>
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedServiceId("__custom");
            }}
            sx={{
              bgcolor: "#FFD100",
              color: "#000",
              fontWeight: 800,
              fontSize: "1.05rem",
              px: 3.5,
              py: 1.2,
              borderRadius: 2,
              textTransform: "none",
              boxShadow: "none",
              flexShrink: 0,
              "&:hover": { bgcolor: "#E6BC00", boxShadow: "none" },
            }}
          >
            Custom Intake
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export const ContractForm = ({ isPreview = false, memberId: memberIdProp }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
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

  const { data: memberData } = useQuery(GET_MEMBER_FOR_CUSTOM, {
    variables: { memberId },
    skip: !memberId,
  });
  const member = memberData?.memberById;

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
    ? [Yup.object().shape({}), shoeInfoSchema, Yup.object().shape({}), Yup.object().shape({})]
    : [shoeInfoSchema, Yup.object().shape({}), Yup.object().shape({})];

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
    if (statusData?.memberById?.contractsDisabled) return <NotAcceptingContracts />;
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
      hasMenu && selectedItem ? { id: selectedItem.id } : null;

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
              member={member}
            />
          );
        case 1:
          return <ShoeInfoStep formik={formik} showClientNotes={selectedServiceId === "__custom"} selectedItem={selectedItem} />;
        case 2:
          return <ImageUploadStep formik={formik} />;
        case 3:
          return <ConfirmationStep selectedItem={selectedItem} hasMenu={hasMenu} />;
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
        return <ConfirmationStep selectedItem={null} hasMenu={false} />;
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
