import React from "react";

import {
  Checkbox,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Space,
  Button,
  Tooltip,
} from "antd";

import {
  MinusCircleOutlined,
  PlusOutlined,
  CopyOutlined,
} from "@ant-design/icons";

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

export default ItemsSubForm;
