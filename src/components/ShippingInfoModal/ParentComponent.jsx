import { useState } from "react";
import StyledButton from "../../pages/HomePage/StyledButton";
import ShippingInfoModal from "./ShippingInfoModal";

const ParentComponent = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <StyledButton
        onClick={() => setModalOpen(true)}
        sx={{ mt: 2, px: 4, py: 1.5 }}
      >
        Update Shipping Info
      </StyledButton>

      <ShippingInfoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => console.log("Shipping info updated.")}
      />
    </>
  );
};

export default ParentComponent;
