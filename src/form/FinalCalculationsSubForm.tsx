import React from "react";

import { Form, FormInstance, InputNumber, Space, Table } from "antd";

interface FinalCalculationsSubFormProps {
  form: FormInstance;
}

const FinalCalculationsSubForm = ({ form }: FinalCalculationsSubFormProps) => {
  return (
    <Form.Item shouldUpdate>
      {() => {
        // O(n): Calculate subtotal and total.
        const subtotal = (form.getFieldValue("items") ?? []).reduce(
          (prev: number, curr: any) => prev + curr["cost"],
          0
        );
        const total =
          subtotal +
          (form.getFieldValue("tax") ?? 0) +
          form.getFieldValue("tip");

        // O(persons): Get names of each person.
        const personNames = (form.getFieldValue("persons") ?? []).map(
          (person: any, idx: number) => person?.name || `Person ${idx + 1}`
        );

        // O(persons): Build the dictionary to add to as we traverse through items.
        const totalOwedByPersonName: { [personName: string]: number } = {};
        personNames.forEach((personName: string) => {
          totalOwedByPersonName[personName] = 0;
        });

        // O(items): Traverse items and add cost to each person. If nobody is assigned, ignore the cost.
        //                                                       ^^ TODO: Display a warning for this?
        (form.getFieldValue("items") ?? []).forEach((item: any) => {
          (item.persons ?? []).forEach(
            (personName: string, _: any, personNames: string[]) => {
              totalOwedByPersonName[personName] +=
                (item.cost / personNames.length) * (total / subtotal);
            }
          );
        });

        const columns = [
          {
            title: "Name",
            dataIndex: "name",
          },
          {
            title: "Owed",
            dataIndex: "owed",
          },
        ];

        const dataSource = Object.entries(totalOwedByPersonName).map(
          ([name, owed]) => ({
            name,
            owed: `$ ${owed.toFixed(2)}`,
            key: name,
          })
        );

        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Space direction="vertical">
              <InputNumber
                addonBefore="Subtotal"
                prefix="$"
                value={subtotal}
                precision={2}
                readOnly
                style={{ marginBottom: "24px" }}
              />

              <Form.Item
                name={["tax"]}
                rules={[
                  {
                    required: true,
                    message: "Missing tax",
                  },
                ]}
                initialValue={0}
              >
                <InputNumber
                  addonBefore="Tax"
                  prefix="$"
                  controls={false}
                  keyboard={false}
                  min={0}
                  precision={2}
                />
              </Form.Item>

              <Form.Item
                name={["tip"]}
                rules={[
                  {
                    required: true,
                    message: "Missing tip",
                  },
                ]}
                initialValue={0}
              >
                <InputNumber
                  addonBefore="Tip"
                  prefix="$"
                  controls={false}
                  keyboard={false}
                  min={0}
                  precision={2}
                />
              </Form.Item>

              <InputNumber
                addonBefore={<strong>Total</strong>}
                prefix="$"
                value={total}
                precision={2}
                readOnly
              />

              {dataSource.length > 0 ? (
                <Table
                  style={{ marginTop: "24px" }}
                  columns={columns}
                  dataSource={dataSource}
                  pagination={false}
                />
              ) : (
                <p>Nothing to show yet. Probably do something different.</p>
              )}
            </Space>
          </div>
        );
      }}
    </Form.Item>
  );
};

export default FinalCalculationsSubForm;
