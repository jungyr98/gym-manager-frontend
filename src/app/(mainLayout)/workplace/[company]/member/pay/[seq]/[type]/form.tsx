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
  Modal,
} from "antd";
import { useForm } from "antd/es/form/Form";
import type { DescriptionsProps, TabsProps } from "antd";
import ko from "antd/es/date-picker/locale/ko_KR";
import dayjs from "dayjs";
import { useRouter, useParams } from "next/navigation";
import PayMemberList from "./memberList";
import PayMembershipList from "./membershipList";
import {
  API_VERSION,
  SERVER_API_URL,
} from "../../../../../../../../utils/global";
import { ALERT, FETCH } from "../../../../../../../../lib/utils";

/**
 * 결제 내역 폼
 * @returns PayForm
 */
const PayForm = () => {
  const params = useParams();
  const company = params?.company ?? 1;
  const seq = params?.seq;
  const type = params?.type;
  const router = useRouter();
  const [form] = useForm();
  const [detailData, setDetailData] = useState<any>();
  const [memberListOpen, setMemberListOpen] = useState<boolean>(false);
  const [membershipListOpen, setMembershipListOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // 목록 이동
  const onList = () => {
    if (!window.confirm("저장되지 않은 내용은 모두 삭제됩니다.")) {
      return false;
    }
    router.push(`/workplace/${company}/member/pay`);
  };

  // 상세 화면 진입
  const onDetail = () => {
    if (!window.confirm("수정을 취소하시겠습니까?")) {
      return false;
    }
    router.push(`/workplace/${company}/member/pay/${seq}/detail`);
  };

  // 수정 화면 진입
  const onUpdate = () => {
    router.push(`/workplace/${company}/member/pay/${seq}/update`);
  };

  // 상세 데이터 호출
  const onDetailData = async () => {
    try {
      const result = await FETCH(
        `${SERVER_API_URL}/${API_VERSION}/member/pay/${seq}`
      )
        .then((res) => res?.json())
        .then((res) => {
          return res?.result;
        })
        .catch((e) => {
          console.log(e);
        });

      setDetailData(result);
      form.setFieldsValue({
        phName: result?.phName,
        phPrice: result?.phPrice,
        phType: result?.phType,
        memberseq: result?.memberSeq,
        memberName: result?.memberName,
        membershipSeq: result?.membershipSeq,
        membershipName: result?.membershipName,
        regDate: result?.regDate && dayjs(result?.regDate),
      });
    } catch (error) {}
  };

  // 저장 OR 수정
  const onFinish = async (fieldValues: any) => {
    setLoading(true);
    if (type === "insert") {
      if (!window.confirm("저장하시겠습니까?")) {
        setLoading(false);
        return false;
      }

      try {
        await FETCH(`${SERVER_API_URL}/${API_VERSION}/member/pay`, {
          method: "POST",
          body: JSON.stringify(fieldValues),
        })
          .then((res) => res?.json())
          .then((res) => {
            if (res?.status === 200) {
              alert("저장되었습니다.");
            } else {
              alert(res?.message);
              console.log(res?.status + " : " + res?.message);
            }
          })
          .catch((e) => {
            console.log(e);
          })
          .finally(() => setLoading(false));
      } catch (error) {}

      router.push(`/workplace/${company}/member/pay`);
    } else {
      if (!window.confirm("수정하시겠습니까?")) {
        setLoading(false);
        return false;
      }

      try {
        await FETCH(`${SERVER_API_URL}/${API_VERSION}/member/pay`, {
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

      router.push(`/workplace/${company}/member/pay/${seq}/detail`);
    }
  };

  // 회원 목록 모달 OPEN
  const onMemberList = () => {
    setMemberListOpen(true);
  };

  // 회원권 목록 모달 OPEN
  const onMembershipList = () => {
    setMembershipListOpen(true);
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
        <Descriptions title="결제 내역" bordered>
          <Descriptions.Item label="결제자 명">
            {type === "detail" ? (
              detailData?.phName
            ) : (
              <Form.Item name={"phName"} rules={[{ required: true }]} noStyle>
                <Input style={{ width: "40%" }} maxLength={30} />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="결제 금액" span={2}>
            {type === "detail" ? (
              `${detailData?.phPrice}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            ) : (
              <Form.Item name={"phPrice"} rules={[{ required: true }]} noStyle>
                <InputNumber
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) =>
                    value?.replace(/\$\s?|(,*)/g, "") as unknown as number
                  }
                  style={{ width: "50%" }}
                />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="결제 방법">
            {type === "detail" ? (
              detailData?.phType === "CASH" ? (
                "계좌이체"
              ) : (
                "카드결제"
              )
            ) : (
              <Form.Item
                name={"phType"}
                initialValue={""}
                rules={[{ required: true }]}
                noStyle
              >
                <Select
                  options={[
                    { value: "", label: "선택" },
                    { value: "CASH", label: "계좌이체" },
                    { value: "CARD", label: "카드결제" },
                  ]}
                  style={{
                    width: "25%",
                  }}
                />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="결제 일자" span={2}>
            {type === "detail" ? (
              dayjs(detailData?.regDate).format("YYYY-MM-DD")
            ) : (
              <Form.Item name={"regDate"} rules={[{ required: true }]} noStyle>
                <DatePicker
                  picker="date"
                  style={{ width: "50%" }}
                  locale={ko}
                />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="회원 명">
            {type === "detail" ? (
              detailData?.memberName
            ) : (
              <>
                <Form.Item name={"memberSeq"} hidden />
                <Form.Item
                  name={"memberName"}
                  rules={[{ required: true }]}
                  noStyle
                >
                  <Input.Search
                    onSearch={onMemberList}
                    allowClear
                    style={{ width: "50%" }}
                  />
                </Form.Item>
              </>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="구매 명" span={2}>
            {type === "detail" ? (
              detailData?.membershipName
            ) : (
              <>
                <Form.Item name={"membershipSeq"} hidden />
                <Form.Item
                  name={"membershipName"}
                  rules={[{ required: true }]}
                  noStyle
                >
                  <Input.Search
                    onSearch={onMembershipList}
                    allowClear
                    style={{ width: "70%" }}
                  />
                </Form.Item>
              </>
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
      {/* 회원 목록 Modal */}
      <Modal
        title={"회원 목록"}
        open={memberListOpen}
        width={1000}
        onCancel={() => {
          if (confirm("저장되지 않은 내용은 모두 삭제됩니다.")) {
            setMemberListOpen(false);
          }
        }}
        destroyOnClose={true}
        footer={null}
      >
        <PayMemberList
          onSaveComplete={(memberSeq: number, memberName: string) => {
            if (memberSeq !== 0) {
              // 회원 정보 세팅
              form.setFieldValue("memberSeq", memberSeq);
              form.setFieldValue("memberName", memberName);
            }
            setMemberListOpen(false);
          }}
        />
      </Modal>

      {/* 회원권 목록 Modal */}
      <Modal
        title={"회원권 목록"}
        open={membershipListOpen}
        width={700}
        onCancel={() => {
          if (confirm("저장되지 않은 내용은 모두 삭제됩니다.")) {
            setMembershipListOpen(false);
          }
        }}
        destroyOnClose={true}
        footer={null}
      >
        <PayMembershipList
          onSaveComplete={(membershipSeq: number, membershipName: string) => {
            if (membershipSeq !== 0) {
              // 회원권 정보 세팅
              form.setFieldValue("membershipSeq", membershipSeq);
              form.setFieldValue("membershipName", membershipName);
            }
            setMembershipListOpen(false);
          }}
        />
      </Modal>
    </>
  );
};

export default PayForm;
