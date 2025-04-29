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
} from "antd";
import { useForm } from "antd/es/form/Form";
import type { TabsProps } from "antd";
import ko from "antd/es/date-picker/locale/ko_KR";
import dayjs from "dayjs";
import { useRouter, useParams } from "next/navigation";
import { API_VERSION, SERVER_API_URL } from "../../../../../../../utils/global";
import { MembershipVO } from "../../../../../../../types";
import { FETCH } from "../../../../../../../lib/utils";

const MembershipForm = () => {
  const params = useParams();
  const company = params?.company ?? 1;
  const seq = params?.seq;
  const type = params?.type;
  const router = useRouter();
  const [form] = useForm();
  const [detailData, setDetailData] = useState<MembershipVO>();
  const [loading, setLoading] = useState<boolean>(false);

  // 목록 이동
  const onList = () => {
    if (type !== "detail") {
      if (!window.confirm("저장되지 않은 내용은 모두 삭제됩니다.")) {
        return false;
      }
    }
    router.push(`/workplace/${company}/membership`);
  };

  // 상세 화면 진입
  const onDetail = () => {
    if (!window.confirm("수정을 취소하시겠습니까?")) {
      return false;
    }
    router.push(`/workplace/${company}/membership/${seq}/detail`);
  };

  // 수정 화면 진입
  const onUpdate = () => {
    router.push(`/workplace/${company}/membership/${seq}/update`);
  };

  // 상세 데이터 호출
  const onDetailData = async () => {
    try {
      const result = await FETCH(
        `${SERVER_API_URL}/${API_VERSION}/membership/${seq}`
      )
        .then((res) => res?.json())
        .then((res) => {
          return res.result;
        })
        .catch((e) => {
          console.log(e);
        });

      setDetailData(result);
      form.setFieldsValue({
        membershipSeq: seq,
        membershipName: result?.membershipName,
        membershipPeriod: result?.membershipPeriod,
        membershipRegId: result?.regId,
        membershipRegDate: result?.regDate,
      });
    } catch (error) {}
  };

  // 저장 OR 수정
  const onFinish = async (fieldValues: MembershipVO) => {
    setLoading(true);
    if (type === "insert") {
      if (!window.confirm("저장하시겠습니까?")) {
        setLoading(false);
        return false;
      }

      try {
        await FETCH(`${SERVER_API_URL}/${API_VERSION}/membership`, {
          method: "POST",
          body: JSON.stringify(fieldValues),
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

      router.push(`/workplace/${company}/membership`);
    } else {
      if (!window.confirm("수정하시겠습니까?")) {
        setLoading(false);
        return false;
      }

      try {
        await FETCH(`${SERVER_API_URL}/${API_VERSION}/membership`, {
          method: "PUT",
          body: JSON.stringify(fieldValues),
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

      router.push(`/workplace/${company}/membership/${seq}/detail`);
    }
  };

  useEffect(() => {
    if (type !== "insert") {
      onDetailData();
    }
  }, []);
  return (
    <>
      {/* Form Area */}
      <Form form={form} onFinish={onFinish}>
        {/* Top Button Area */}
        <div className="btn-area-detail">
          {type === "detail" ? (
            <Button type="primary" onClick={onUpdate} loading={loading}>
              수정
            </Button>
          ) : (
            <Button type="primary" htmlType={"submit"} loading={loading}>
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
        <Descriptions title="회원권 정보" bordered>
          <Descriptions.Item label="회원권 이름" span={3}>
            <Form.Item name={"wpSeq"} initialValue={company} hidden />
            <Form.Item name={"membershipSeq"} initialValue={company} hidden />
            <Form.Item name={"regId"} initialValue={"user1"} hidden />
            {type === "detail" ? (
              <div style={{ width: "200px" }}>{detailData?.membershipName}</div>
            ) : (
              <Form.Item
                name={"membershipName"}
                rules={[{ required: true, message: "필수항목입니다." }]}
                noStyle
              >
                <Input style={{ width: "40%" }} maxLength={30} />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="회원권 기간">
            {type === "detail" ? (
              <>{detailData?.membershipPeriod}개월</>
            ) : (
              <Form.Item
                name={"membershipPeriod"}
                initialValue={""}
                rules={[{ required: true, message: "필수항목입니다." }]}
                noStyle
              >
                <Select
                  options={[
                    { value: "", label: "선택" },
                    { value: "1", label: "1개월" },
                    { value: "3", label: "3개월" },
                    { value: "6", label: "6개월" },
                    { value: "12", label: "12개월" },
                  ]}
                  style={{
                    width: "25%",
                  }}
                />
              </Form.Item>
            )}
          </Descriptions.Item>
        </Descriptions>
        {/* Bottom Button Area */}
        <div className="btn-area-detail">
          {type === "detail" ? (
            <Button type="primary" onClick={onUpdate} loading={loading}>
              수정
            </Button>
          ) : (
            <Button type="primary" htmlType={"submit"} loading={loading}>
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

export default MembershipForm;
