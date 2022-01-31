import React from "react";

import {
  Checkbox,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Space,
  Button,
  Divider,
  Tooltip,
  Table,
} from "antd";

import {
  MinusCircleOutlined,
  PlusOutlined,
  CopyOutlined,
} from "@ant-design/icons";

const App = () => {
  return (
    <div style={{ margin: "1rem" }}>
      <ReceiptForm />
    </div>
  );
};

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

const PersonsSubForm = () => {
  return (
    <div
      style={{ marginTop: "1vh", display: "flex", justifyContent: "center" }}
    >
      <Form.List name="persons">
        {(fields, { add, remove }) => (
          <div>
            {fields.map(({ key, name, ...field }, idx: number) => (
              <Space
                key={key}
                style={{ display: "flex", justifyContent: "center" }}
                align="baseline"
              >
                <Form.Item
                  {...field}
                  name={[name, "name"]}
                  rules={[{ required: true, message: "Missing name" }]}
                >
                  <Input placeholder={`Person ${idx + 1}`} />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add name
              </Button>
            </Form.Item>
          </div>
        )}
      </Form.List>
    </div>
  );
};

interface ItemsSubFormProps {
  form: FormInstance;
}

const ItemsSubForm = ({ form }: ItemsSubFormProps) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <div>
            <Space direction="vertical">
              {fields.map(({ key, name, ...field }) => (
                <div key={key}>
                  <Form.Item shouldUpdate>
                    {() => {
                      const personNames = (
                        form.getFieldValue("persons") ?? []
                      ).map(
                        (person: any, idx: number) =>
                          person?.name || `Person ${idx + 1}`
                      );

                      return (
                        <>
                          <Space direction="horizontal">
                            <Form.Item name={[name, "persons"]}>
                              <Checkbox.Group>
                                {personNames.map((personName: string) => (
                                  <Tooltip key={personName} title={personName}>
                                    <Checkbox value={personName} />
                                  </Tooltip>
                                ))}
                              </Checkbox.Group>
                            </Form.Item>

                            <Form.Item
                              name={[name, "name"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Missing name",
                                },
                              ]}
                            >
                              <Input addonBefore="Name" />
                            </Form.Item>

                            <Form.Item
                              name={[name, "cost"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Missing cost",
                                },
                              ]}
                              initialValue={0}
                            >
                              <InputNumber
                                addonBefore="Cost"
                                prefix="$"
                                controls={false}
                                keyboard={false}
                                min={0}
                                precision={2}
                              />
                            </Form.Item>

                            <MinusCircleOutlined onClick={() => remove(name)} />
                            <CopyOutlined onClick={() => alert("Duplicate")} />
                          </Space>
                        </>
                      );
                    }}
                  </Form.Item>
                </div>
              ))}
            </Space>

            <div>
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add item
                </Button>
              </Form.Item>
            </div>
          </div>
        )}
      </Form.List>
    </div>
  );
};

export default App;

