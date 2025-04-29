"use client";

import { Button, Form, Input, message, Tag } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./index.css";
import { useForm } from "antd/es/form/Form";
import { API_VERSION, SERVER_API_URL, URLParams } from "../../utils/global";

export default function VisitForm() {
  const [form] = useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // 숫자 패드 클릭 이벤트
  const onNumClick = (endNum: number) => {
    for (let i = 0; i < 4; i++) {
      let numberInput = form.getFieldValue(`numberPad_${i}`);
      if (numberInput === undefined || numberInput === null) {
        form.setFieldValue(`numberPad_${i}`, endNum);
        return;
      }
    }
  };

  // Backspace 버튼 클릭 이벤트
  const onNumDelete = () => {
    for (let i = 3; i > -1; i--) {
      let numberInput = form.getFieldValue(`numberPad_${i}`);
      if (numberInput !== undefined && numberInput !== null) {
        form.setFieldValue(`numberPad_${i}`, null);
        return;
      }
    }
  };

  // 방문 등록 처리
  const onFinish = async (fieldValues: any) => {
    const arr = [
      fieldValues?.numberPad_0,
      fieldValues?.numberPad_1,
      fieldValues?.numberPad_2,
      fieldValues?.numberPad_3,
    ];
    const fmtWord = { lastPhoneNumber: arr.join("") };
    const queryString = URLParams(fmtWord);

    if (fmtWord?.lastPhoneNumber.length === 4) {
      try {
        await fetch(`${SERVER_API_URL}/${API_VERSION}/visit?${queryString}`)
          .then((res) => res.json())
          .then((res) => {
            if (res?.status === 500) {
              messageApi.open({
                type: "error",
                content: res?.message,
                style: {
                  height: "100px",
                  //marginTop: "50vh",
                },
              });
            } else if (res?.status === 200) {
              const successMessage =
                res?.result?.list[0].memberName +
                " 님 방문 등록 완료되었습니다.";
              messageApi.open({
                type: "success",
                content: successMessage,
                style: {
                  height: "100px",
                  //marginTop: "50vh",
                },
              });
            }
          })
          .catch((e) => console.log(e))
          .finally(() => {
            form.setFieldsValue({
              numberPad_0: null,
              numberPad_1: null,
              numberPad_2: null,
              numberPad_3: null,
            });
          });
      } catch (error) {}
    } else {
      messageApi.open({
        type: "error",
        content: "4자리를 입력해주세요.",
      });
      return;
    }
  };

  // 숫자 패드 렌더링
  const NumberPad = () => {
    const result = [];
    for (let i = 0; i < 10; i++) {
      result.push(
        <Button
          key={`numberPad_${i}`}
          onClick={() => onNumClick(i)}
          style={{
            width: `${i > 0 ? "33%" : "100%"}`,
            height: "70px",
            fontSize: "20px",
            margin: "1px 0",
            borderRadius: "0",
          }}
        >
          {i}
        </Button>
      );
    }
    return result;
  };
  return (
    <div className="visitFullArea">
      {contextHolder}
      <Form form={form} onFinish={onFinish} style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="visit-width-box">
            <Tag className="visit-info-tag" color="processing">
              휴대폰 뒷번호 4자리를 입력해주세요.
            </Tag>
            <div className="visit-number-input-box">
              <Form.Item name={"numberPad_0"} noStyle>
                <Input
                  className={"checkNumberPad"}
                  style={{
                    height: "70px",
                  }}
                  readOnly
                />
              </Form.Item>
              <Form.Item name={"numberPad_1"} noStyle>
                <Input className={"checkNumberPad"} readOnly />
              </Form.Item>
              <Form.Item name={"numberPad_2"} noStyle>
                <Input className={"checkNumberPad"} readOnly />
              </Form.Item>
              <Form.Item name={"numberPad_3"} noStyle>
                <Input className={"checkNumberPad"} readOnly />
              </Form.Item>
            </div>
            <div className="visit-number-pad-box">
              <div className="visit-number-pad-wrap">
                <NumberPad />
              </div>
              <div className="visit-number-btn-box">
                <Button htmlType={"submit"} className="visit-number-submit-btn">
                  등록
                </Button>
                <Button
                  onClick={onNumDelete}
                  icon={<ArrowLeftOutlined />}
                  className="visit-number-backspace-btn"
                ></Button>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
