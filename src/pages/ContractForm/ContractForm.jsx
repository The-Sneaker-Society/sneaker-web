import React, { useState } from "react";
import { Box, Stepper, Step, StepLabel, Button } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import ShoeInfoStep from "./ShoeInfoStep";
import ImageUploadStep from "./ImageUploadStep";
import ConfirmationStep from "./ConfirmStep";
import { useParams } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

const CREATE_CONTRACT = gql`
  mutation createContract($data: CreateContractInput!) {
    createContract(data: $data) {
      id
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
    clientNotes: Yup.string().required("Please explain your repair request"),
  }),
});

const initialValues = {
  shoeDetails: {
    brand: "nike",
    model: "dfhad",
    color: "dbhad",
    material: "fdbad",
    size: "12",
    soleCondition: "none",
    clientNotes: "zdjgvadf",
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

export const ContractForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { memberId } = useParams();
  const [createContract] = useMutation(CREATE_CONTRACT);

  const steps = ["Shoe Information", "Image Upload", "Confirmation"];

  const validationSchemas = [ShoeInfoSchema];

  const handleNext = (values, { setTouched, setSubmitting }) => {
    setTouched({});
    setSubmitting(false);
    console.log(`Step ${activeStep + 1} Values:`, values);
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
    <Box sx={{ width: "100%", height: "100%" }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box mt={4}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchemas[activeStep]}
          onSubmit={activeStep === steps.length - 1 ? handleSubmit : handleNext}
        >
          {(formik) => (
            <Form>
              {getStepContent(activeStep, formik)}
              <Box mt={4} display="flex" justifyContent="space-between">
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={formik.isSubmitting}
                >
                  {activeStep === steps.length - 1 ? "Submit" : "Next"}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};
