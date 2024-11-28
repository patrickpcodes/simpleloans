"use client";

import CustomerManagementForm from "@/components/CustomerManagementForm";

const CreateCustomer: React.FC = () => {
  return (
    <div className="p-8">
      <h2>Im in create customer page</h2>
      <CustomerManagementForm />
    </div>
  );
};

export default CreateCustomer;
