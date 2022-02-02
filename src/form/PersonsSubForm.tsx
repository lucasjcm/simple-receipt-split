import React from "react";

import { Form, Input, Space, Button } from "antd";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

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

export default PersonsSubForm;
