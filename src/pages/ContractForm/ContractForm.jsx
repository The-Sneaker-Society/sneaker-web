import React, { useState } from "react";
import { Box, Stepper, Step, StepLabel, Button, Alert, Typography, Paper, Chip, Table, TableBody, TableRow, TableCell, Radio } from "@mui/material";
import { FiGrid, FiList } from "react-icons/fi";
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

const ShoeInfoSchema = Yup.object().shape({
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
    clientNotes: Yup.string().required("Please explain your repair request"),
  }),
});

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

function IntakeServiceCard({ item, selected, onSelect, isCustom }) {
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
        gridColumn: isCustom ? { xs: "span 1", md: "span 2" } : "auto",
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

export const ContractForm = ({ isPreview = false, memberId: memberIdProp }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState("__custom");
  const [intakeViewMode, setIntakeViewMode] = useState(() => {
    try {
      return localStorage.getItem("serviceMenuIntakeView") || localStorage.getItem("serviceMenuView") || "grid";
    } catch {
      return "grid";
    }
  });
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

  const steps = ["Shoe Information", "Image Upload", "Confirmation"];

  const validationSchemas = [ShoeInfoSchema];

  const handleNext = (values, { setTouched, setSubmitting }) => {
    setTouched({});
    setSubmitting(false);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const serviceMenu = menuData?.getServiceMenu || [];
  const activeItems = serviceMenu.filter((i) => i.isActive);
  const hasMenu = !menuError && activeItems.length > 0;
  const selectedItem = activeItems.find((i) => i.id === selectedServiceId) || null;

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

  const persistIntakeView = (mode) => {
    setIntakeViewMode(mode);
    try {
      localStorage.setItem("serviceMenuIntakeView", mode);
    } catch {
      // ignore
    }
  };

  const getStepContent = (step, formik) => {
    switch (step) {
      case 0:
        return (
          <>
            {hasMenu && (
              <Box sx={{ mb: 3 }}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1} mb={1.5}>
                    <Typography variant="h6" fontWeight={600}>
                      Select a Service
                    </Typography>
                    <Box display="flex" gap={0.5} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1.5, overflow: "hidden" }}>
                      <Button
                        size="small"
                        startIcon={<FiGrid size={14} />}
                        onClick={() => persistIntakeView("grid")}
                        variant={intakeViewMode === "grid" ? "contained" : "text"}
                        sx={{ borderRadius: 0, minWidth: 70 }}
                      >
                        Grid
                      </Button>
                      <Button
                        size="small"
                        startIcon={<FiList size={14} />}
                        onClick={() => persistIntakeView("list")}
                        variant={intakeViewMode === "list" ? "contained" : "text"}
                        sx={{ borderRadius: 0, minWidth: 70 }}
                      >
                        List
                      </Button>
                    </Box>
                  </Box>
                  {intakeViewMode === "grid" ? (
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 1.5 }}>
                      {activeItems.map((item) => (
                        <IntakeServiceCard
                          key={item.id}
                          item={item}
                          selected={selectedServiceId === item.id}
                          onSelect={() => setSelectedServiceId(item.id)}
                          isCustom={false}
                        />
                      ))}
                      <IntakeServiceCard
                        item={{ name: "Custom Request", description: "Describe your repair — member will price it." }}
                        selected={selectedServiceId === "__custom"}
                        onSelect={() => setSelectedServiceId("__custom")}
                        isCustom
                      />
                    </Box>
                  ) : (
                    <Table size="small">
                      <TableBody>
                        {activeItems.map((item) => (
                          <TableRow
                            key={item.id}
                            hover
                            selected={selectedServiceId === item.id}
                            onClick={() => setSelectedServiceId(item.id)}
                            sx={{ cursor: "pointer" }}
                          >
                            <TableCell padding="checkbox">
                              <Radio checked={selectedServiceId === item.id} size="small" />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{item.name}</TableCell>
                            <TableCell>
                              <Chip label={`$${item.price}`} size="small" />
                            </TableCell>
                            <TableCell sx={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {item.description || "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow
                          hover
                          selected={selectedServiceId === "__custom"}
                          onClick={() => setSelectedServiceId("__custom")}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell padding="checkbox">
                            <Radio checked={selectedServiceId === "__custom"} size="small" />
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Custom Request</TableCell>
                          <TableCell>
                            <Chip label="Custom" size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>Describe your repair below</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  )}
                  {selectedItem && (
                    <Typography variant="body2" color="text.secondary" mt={1.5}>
                      Selected: {selectedItem.name} — price hint ${selectedItem.price}. Member retains final price authority.
                    </Typography>
                  )}
                  {selectedServiceId === "__custom" && (
                    <Typography variant="body2" color="text.secondary" mt={1.5}>
                      Describe your custom request in notes below.
                    </Typography>
                  )}
                </Paper>
              </Box>
            )}
            <ShoeInfoStep formik={formik} showClientNotes={hasMenu ? selectedServiceId === "__custom" : true} selectedItem={selectedItem} />
          </>
        );
      case 1:
        return <ImageUploadStep formik={formik} />;
      case 2:
        return <ConfirmationStep formik={formik} />;
      default:
        return "Unknown step";
    }
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
                    disabled={formik.isSubmitting || (isPreview && activeStep === steps.length - 1)}
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
