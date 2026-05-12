import React from "react";
import { useSneakerMember } from "../../context/MemberContext";
import { ContractForm } from "./ContractForm";
import { LoadingCircle } from "../../components/LoadingCircle";

const PreviewContractPage = () => {
  const { member, loading } = useSneakerMember();

  if (loading) return <LoadingCircle />;
  if (!member?.id) return <div>Unauthorized preview access</div>;

  return <ContractForm isPreview={true} memberId={member.id} />;
};

export default PreviewContractPage;
