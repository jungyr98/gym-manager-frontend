"use client";

import { Form, Descriptions, Input, Select, Button, DatePicker } from "antd";
import { useForm } from "antd/es/form/Form";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SERVER_API_URL, API_VERSION } from "../../../../../utils/global";
import dayjs from "dayjs";
import ko from "antd/es/calendar/locale/ko_KR";
import { CalendarVO } from "../../../../../types";
import { FETCH } from "../../../../../lib/utils";

type Props = {
  clSeq?: number | undefined;
  selectedDate?: string;
  onSaveComplete?: (clSeq: number) => void;
};

export default function CalendarForm({
  clSeq,
  selectedDate,
  onSaveComplete,
}: Props) {
  const params = useParams();
  const company = params?.company ?? 1;
  const router = useRouter();
  const [type, setType] = useState<string>(
    clSeq === undefined ? "insert" : "update"
  );
  const seq = clSeq;
  const [form] = useForm();
  const [detailData, setDetailData] = useState<CalendarVO>();
  const [loading, setLoading] = useState<boolean>(false);

  // 상세 데이터 호출
  const onDetailData = async () => {
    try {
      const response = await FETCH(
        `${SERVER_API_URL}/${API_VERSION}/calendar/${seq}`
      )
        .then((res) => res?.json())
        .then((res) => {
          return res?.result;
        })
        .catch((e) => {
          console.log(e);
        });

      setDetailData(response);
      form.setFieldsValue({
        clSeq: response?.seq,
        clType: response?.clType,
        clContent: response?.clContent,
        regDate: response?.regDate,
      });
    } catch (error) {}
  };

  // 저장 OR 수정
  const onFinish = async (fieldValues: CalendarVO) => {
    setLoading(true);
    if (seq === undefined) {
      if (!window.confirm("저장하시겠습니까?")) {
        setLoading(false);
        return false;
      }

      const data = {
        ...fieldValues,
        regDate: fieldValues?.regDate,
      };

      try {
        await FETCH(`${SERVER_API_URL}/${API_VERSION}/calendar`, {
          method: "POST",
          body: JSON.stringify(data),
        })
          .then((res) => res?.json())
          .then((res) => {
            alert("저장되었습니다.");
          })
          .catch((e) => {
            console.log(e);
          })
          .finally(() => setLoading(false));
      } catch (error) {}
    } else {
      if (!window.confirm("수정하시겠습니까?")) {
        return false;
      }
      const data = {
        ...fieldValues,
        clSeq: seq,
        regDate: fieldValues?.regDate ?? selectedDate,
      };

      try {
        await FETCH(`${SERVER_API_URL}/${API_VERSION}/calendar`, {
          method: "PUT",
          body: JSON.stringify(data),
        })
          .then((res) => res?.json())
          .then((res) => {
            alert("수정되었습니다.");
          })
          .catch((e) => {
            console.log(e);
          })
          .finally(() => setLoading(false));
      } catch (error) {}
    }

    onSaveComplete && onSaveComplete(0);
  };

  // 삭제
  const onDelete = async () => {
    if (!window.confirm("삭제하시겠습니까?")) {
      return;
    }

    const data = {
      clSeq: seq,
    };

    try {
      await FETCH(`${SERVER_API_URL}/${API_VERSION}/calendar`, {
        method: "DELETE",
        body: JSON.stringify(data),
      })
        .then((res) => res?.json())
        .then((res) => {
          alert("삭제되었습니다.");
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {}

    onSaveComplete && onSaveComplete(0);
  };

  useEffect(() => {
    if (seq !== undefined) {
      onDetailData();
    }
  }, []);

  return (
    <>
      {/* Form Area */}
      <Form form={form} onFinish={onFinish}>
        {/* Top Button Area */}
        <div className="btn-area-detail"></div>
        {/* Detail Area */}
        <Descriptions title={selectedDate} bordered>
          {seq === undefined && (
            <Descriptions.Item label="일정 날짜" span={3}>
              <Form.Item
                name={"regDate"}
                rules={[{ required: true, message: "필수항목입니다." }]}
                noStyle
              >
                <DatePicker picker="date" locale={ko} />
              </Form.Item>
            </Descriptions.Item>
          )}
          <Descriptions.Item label="일정 타입" span={3}>
            <Form.Item name={"wpSeq"} initialValue={1} hidden />
            <Form.Item name={"regId"} initialValue={"user1"} hidden />
            <Form.Item
              name={"clType"}
              initialValue={""}
              rules={[{ required: true, message: "필수항목입니다." }]}
              noStyle
            >
              <Select
                options={[
                  { value: "", label: "선택" },
                  { value: "D", label: "기본" },
                  { value: "I", label: "중요" },
                ]}
                style={{
                  width: "35%",
                }}
              />
            </Form.Item>
          </Descriptions.Item>
          <Descriptions.Item label="일정 내용">
            <Form.Item
              name={"clContent"}
              initialValue={""}
              rules={[{ required: true, message: "필수항목입니다." }]}
              noStyle
            >
              <Input style={{ width: "90%" }} maxLength={30} />
            </Form.Item>
          </Descriptions.Item>
        </Descriptions>
        {/* Bottom Button Area */}
        <div className="btn-area-detail">
          <Button type="primary" htmlType={"submit"}>
            저장
          </Button>
          {type === "update" && (
            <Button type="primary" onClick={onDelete}>
              삭제
            </Button>
          )}
          <Button
            type="primary"
            onClick={async () => {
              if (await confirm("저장되지 않은 내용은 모두 삭제됩니다.")) {
                onSaveComplete && onSaveComplete(0);
              }
            }}
          >
            취소
          </Button>
        </div>
      </Form>
    </>
  );
}
