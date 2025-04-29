"use client";

import { useState, useEffect } from "react";
import {
  Badge,
  Descriptions,
  Button,
  Tabs,
  Input,
  Select,
  Form,
  DatePicker,
  InputNumber,
  Switch,
} from "antd";
import { useForm } from "antd/es/form/Form";
import type { DescriptionsProps, TabsProps } from "antd";
import ko from "antd/es/date-picker/locale/ko_KR";
import dayjs from "dayjs";
import { useRouter, useParams } from "next/navigation";

const result = {
  smType: true,
  smTitle: "회원비 납부 요청 메세지",
  smContent: "성명: #이름 청구내용: #년 #월분 청구일자: # 청구금액: # 원",
};

const MessageForm = () => {
  const params = useParams();
  const company = params?.company ?? 1;
  const seq = params?.seq;
  const type = params?.type;
  const router = useRouter();
  const [form] = useForm();
  const [detailData, setDetailData] = useState<any>(result);
  // 목록 이동
  const onList = () => {
    if (!window.confirm("저장되지 않은 내용은 모두 삭제됩니다.")) {
      return false;
    }
    router.push(`/workplace/${company}/message`);
  };

  // 상세 화면 진입
  const onDetail = () => {
    if (!window.confirm("수정을 취소하시겠습니까?")) {
      return false;
    }
    router.push(`/workplace/${company}/message/${seq}/detail`);
  };

  // 수정 화면 진입
  const onUpdate = () => {
    router.push(`/workplace/${company}/message/${seq}/update`);
  };

  // 상세 데이터 호출
  const onDetailData = async () => {
    try {
      await fetch(``, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((res) => {
          setDetailData(res?.result);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {}
  };

  // 저장
  const onFinish = async (fieldValues: any) => {
    if (!window.confirm("저장하시겠습니까?")) {
      return false;
    }

    console.log(`fieldValues:`, fieldValues);
    //return;

    try {
      await fetch(`SERVER_URL/name/api/v1/send`, {
        method: "POST",
        body: JSON.stringify(fieldValues),
      })
        .then((res) => res.json())
        .then((res) => {
          alert("저장되었습니다.");
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {}

    router.push(`/workplace/${company}/message/detail/${seq}`);
  };

  useEffect(() => {
    console.log(type);
    if (type === "update") {
      form.setFieldsValue({
        smType: detailData?.smType,
        smTitle: detailData?.smTitle,
        smContent: detailData?.smContent,
      });
    }
  }, []);

  return (
    <>
      {/* Form Area */}
      <Form form={form} onFinish={onFinish}>
        {/* Top Button Area */}
        <div className="btn-area-detail">
          {type === "detail" ? (
            <Button type="primary" onClick={onUpdate}>
              수정
            </Button>
          ) : (
            <Button type="primary" htmlType={"submit"}>
              저장
            </Button>
          )}
          {type === "update" && (
            <Button type="primary" onClick={onDetail}>
              취소
            </Button>
          )}
          <Button type="primary" onClick={onList}>
            목록
          </Button>
        </div>
        {/* Detail Area */}
        <Descriptions title="메시지 관리" bordered>
          <Descriptions.Item label="전송 방식">
            {type === "detail" ? (
              <Switch
                checkedChildren="자동"
                unCheckedChildren="수동"
                checked={detailData?.smType}
                disabled={true}
              />
            ) : (
              <Form.Item name={"smType"} noStyle>
                <Switch
                  checkedChildren="자동"
                  unCheckedChildren="수동"
                  defaultChecked={false}
                />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="제목" span={2}>
            {type === "detail" ? (
              "회원비 납부 요청 메세지"
            ) : (
              <Form.Item name={"smTitle"} noStyle>
                <Input style={{ width: "90%" }} />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="전송 내용" span={3}>
            {type === "detail" ? (
              "성명: #이름 청구내용: #년 #월분 청구일자: # 청구금액: # 원"
            ) : (
              <Form.Item name={"smContent"} noStyle>
                <Input.TextArea
                  style={{ width: "300px", height: "400px" }}
                ></Input.TextArea>
              </Form.Item>
            )}
          </Descriptions.Item>
        </Descriptions>
        {/* Bottom Button Area */}
        <div className="btn-area-detail">
          {type === "detail" ? (
            <Button type="primary" onClick={onUpdate}>
              수정
            </Button>
          ) : (
            <Button type="primary" htmlType={"submit"}>
              저장
            </Button>
          )}
          {type === "update" && (
            <Button type="primary" onClick={onDetail}>
              취소
            </Button>
          )}
          <Button type="primary" onClick={onList}>
            목록
          </Button>
        </div>
      </Form>
    </>
  );
};

export default MessageForm;
