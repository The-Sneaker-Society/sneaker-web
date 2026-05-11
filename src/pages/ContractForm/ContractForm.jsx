import React, { useState, useEffect } from "react";
import { Box, Stepper, Step, StepLabel, Button, Alert, Typography, Paper, Divider } from "@mui/material";
import { FiCheck, FiSend, FiMessageCircle, FiDollarSign, FiTruck, FiTool, FiPackage, FiSmile } from "react-icons/fi";
import { keyframes } from "@mui/system";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import ShoeInfoStep from "./ShoeInfoStep";
import ImageUploadStep from "./ImageUploadStep";
import ConfirmationStep from "./ConfirmStep";
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

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const cleanOff = keyframes`
  0%, 30% { opacity: 1; filter: sepia(0.7) saturate(2.5) brightness(0.65); }
  100% { opacity: 0; filter: none; }
`;

const fadeStain = keyframes`
  0%, 15% { opacity: 1; }
  100% { opacity: 0; }
`;

const TIMELINE_STEPS = [
  { icon: <FiSend size={24} />, label: "Submit request", desc: "Tell us about your sneakers and upload photos" },
  { icon: <FiMessageCircle size={24} />, label: "Member reviews", desc: "A member reviews your request and details" },
  { icon: <FiDollarSign size={24} />, label: "Agree on price", desc: "Discuss and agree on the service price" },
  { icon: <FiTruck size={24} />, label: "Ship them off", desc: "Send your sneakers to the member" },
  { icon: <FiTool size={24} />, label: "Work begins", desc: "The member works on your sneakers with progress updates" },
  { icon: <FiCheck size={24} />, label: "Work completed", desc: "Repairs are finished and quality checked" },
  { icon: <FiPackage size={24} />, label: "Shipped back", desc: "Your sneakers are on their way back to you" },
  { icon: <FiSmile size={24} />, label: "Enjoy", desc: "Rock your fresh sneakers" },
];

export const ContractForm = ({ isPreview = false, memberId: memberIdProp }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const { memberId: memberIdParam } = useParams();

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIdx((prev) => (prev + 1) % TIMELINE_STEPS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

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
            <Box sx={{ position: "relative", fontSize: 72, mb: 2, width: 84, height: 84, mx: "auto" }}>
              <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", animation: `${float} 3s ease-in-out infinite` }}>
                👟
              </Box>
              {!isPreview && (
                <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", animation: `${float} 3s ease-in-out infinite, ${cleanOff} 3s ease-in-out forwards` }}>
                  👟
                </Box>
              )}
            </Box>
          <Typography variant="h3" fontWeight={700} mb={1}>
            Start Your Request
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Tell us about your sneakers, upload photos, describe what you want done, and we'll take it from there.
          </Typography>

          <Box sx={{ width: "100%", mb: 4, mt: 5 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, minHeight: 140, position: "relative", overflow: "hidden" }}>
              {TIMELINE_STEPS.map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1.5,
                    position: "absolute",
                    width: "100%",
                    transition: "transform 0.4s ease, opacity 0.4s ease",
                    transform: `translateX(${(i - carouselIdx) * 120}%)`,
                    opacity: i === carouselIdx ? 1 : 0,
                  }}
                >
                  <Box sx={{ width: 56, height: 56, borderRadius: "50%", bgcolor: "primary.main", display: "flex", alignItems: "center", justifyContent: "center", color: "common.white" }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={700}>
                    {item.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280 }}>
                    {item.desc}
                  </Typography>
                </Box>
              ))}
            </Box>
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
