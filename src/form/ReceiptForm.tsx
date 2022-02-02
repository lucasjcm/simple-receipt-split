import React from "react";

import { Form, Divider } from "antd";

import PersonsSubForm from "./PersonsSubForm";
import ItemsSubForm from "./ItemsSubForm";
import FinalCalculationsSubForm from "./FinalCalculationsSubForm";

const RECEIPT_FORM_NAME = "RECEIPT_FORM_NAME";

const ReceiptForm = () => {
  const [form] = Form.useForm();

  return (
    <div>
      <p>
        Assumptions: Anything being split is split evenly, 1 person is paying.
      </p>
      <Divider />
      <Form form={form} name={RECEIPT_FORM_NAME}>
        <PersonsSubForm />
        <Divider />
        <ItemsSubForm form={form} />
        <Divider />
        <FinalCalculationsSubForm form={form} />
        <Divider />
      </Form>
    </div>
  );
};

export default ReceiptForm;
