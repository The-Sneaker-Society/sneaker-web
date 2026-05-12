import React, { useState } from "react";
import { Box, Stepper, Step, StepLabel, Button, Alert, Typography, Paper } from "@mui/material";
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

const ShoeInfoSchema = Yup.object().shape({
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
  shoeDetails: {
    brand: "Jordan",
    model: "Retro 4",
    color: "Bred",
    material: "Leather",
    size: "10.5",
    soleCondition: "Good - minimal wear",
    year: "2024",
    returnTimeframe: "standard",
    odorLevel: "none",
    previousRepairs: false,
    previousRepairsNotes: "",
    clientNotes: "Restoration and deep clean requested. Small scuff on right toe box.",
    photos: {
      leftSide: [],
      rightSide: [],
      topView: [],
      bottomView: [],
      frontView: [],
      backView: [],
      other: [],
    },
  },
};

export const ContractForm = ({ isPreview = false, memberId: memberIdProp }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
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

    await createContract({
      variables: {
        data: {
          memberId,
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
        },
      },
    });
  };

  const getStepContent = (step, formik) => {
    switch (step) {
      case 0:
        return <ShoeInfoStep formik={formik} />;
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
