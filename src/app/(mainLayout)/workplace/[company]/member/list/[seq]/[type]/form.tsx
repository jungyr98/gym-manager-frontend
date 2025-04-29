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
  Table,
} from "antd";
import { useForm } from "antd/es/form/Form";
import type { TabsProps } from "antd";
import ko from "antd/es/date-picker/locale/ko_KR";
import dayjs from "dayjs";
import { useRouter, useParams } from "next/navigation";
import {
  API_VERSION,
  SERVER_API_URL,
} from "../../../../../../../../utils/global";
import {
  MemberVO,
  ResponseListVOPaymentsHistoryVO,
} from "../../../../../../../../types";
import { FETCH } from "../../../../../../../../lib/utils";

const MemberListForm = () => {
  const params = useParams();
  const company = params?.company ?? 1;
  const seq = params?.seq;
  const type = params?.type;
  const router = useRouter();
  const [form] = useForm();
  const [detailData, setDetailData] = useState<MemberVO>();
  const [payHistory, setPayHistory] = useState<ResponseListVOPaymentsHistoryVO>(
    {}
  );
  const [visitHistory, setVisitHistory] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  // 목록 이동
  const onList = () => {
    if (type !== "detail") {
      if (!window.confirm("저장되지 않은 내용은 모두 삭제됩니다.")) {
        return false;
      }
    }
    router.push(`/workplace/${company}/member/list`);
  };

  // 상세 화면 진입
  const onDetail = () => {
    if (!window.confirm("수정을 취소하시겠습니까?")) {
      return false;
    }
    router.push(`/workplace/${company}/member/list/${seq}/detail`);
  };

  // 수정 화면 진입
  const onUpdate = () => {
    router.push(`/workplace/${company}/member/list/${seq}/update`);
  };

  // 탭 변경 이벤트
  const onChange = (key: string) => {
    if (key === "payHistory") {
      onPayHistoryData();
    } else {
      onVisitData();
    }
  };

  // 상세 데이터 호출
  const onDetailData = async () => {
    try {
      const result = await FETCH(
        `${SERVER_API_URL}/${API_VERSION}/member/list/${seq}`
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
        memberSeq: seq,
        memberName: result?.memberName,
        memberBirth: dayjs(result?.memberBirth),
        memberPhone: result?.memberPhone,
        memberSex: result?.memberSex,
        memberAddr: result?.memberAddr,
      });
    } catch (error) {}
  };

  // 결제 기록 데이터 호출
  const onPayHistoryData = async () => {
    try {
      await FETCH(`${SERVER_API_URL}/${API_VERSION}/member/pay/history/${seq}`)
        .then((res) => res?.json())
        .then((res) => {
          setPayHistory(res?.result);
        })
        .catch((e) => console.log(e));
    } catch (error) {}
  };

  // 방문 기록 데이터 호출
  const onVisitData = async () => {
    try {
      await FETCH(`${SERVER_API_URL}/${API_VERSION}/list/visit/${seq}`)
        .then((res) => res?.json())
        .then((res) => {
          setVisitHistory(res?.result);
        })
        .catch((e) => console.log(e));
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

      const data = {
        ...fieldValues,
        memberBirth: dayjs(fieldValues?.memberBirth).format("YYYY-MM-DD"),
      };

      try {
        await FETCH(`${SERVER_API_URL}/${API_VERSION}/member/list`, {
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

      router.push(`/workplace/${company}/member/list`);
    } else {
      if (!window.confirm("수정하시겠습니까?")) {
        setLoading(false);
        return false;
      }

      const data = {
        ...fieldValues,
        memberSeq: seq,
        memberBirth: dayjs(fieldValues?.memberBirth).format("YYYY-MM-DD"),
      };

      try {
        await FETCH(`${SERVER_API_URL}/${API_VERSION}/member/list`, {
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

      router.push(`/workplace/${company}/member/list/${seq}/detail`);
    }
  };

  useEffect(() => {
    if (type !== "insert") {
      onDetailData();
      onPayHistoryData();
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
            <Button type="primary" onClick={onDetail} loading={loading}>
              취소
            </Button>
          )}
          <Button type="primary" onClick={onList} loading={loading}>
            목록
          </Button>
        </div>
        {/* Detail Area */}
        <Descriptions title="회원 정보" bordered>
          <Descriptions.Item label="이름">
            <Form.Item name={"wpSeq"} initialValue={company} hidden />
            {type === "detail" ? (
              detailData?.memberName
            ) : (
              <Form.Item
                name={"memberName"}
                rules={[{ required: true }]}
                noStyle
              >
                <Input style={{ width: "40%" }} maxLength={30} />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="생년월일" span={2}>
            {type === "detail" ? (
              detailData?.memberBirth
            ) : (
              <Form.Item
                name={"memberBirth"}
                rules={[{ required: true }]}
                noStyle
              >
                <DatePicker
                  picker="date"
                  style={{ width: "50%" }}
                  locale={ko}
                />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="성별">
            {type === "detail" ? (
              detailData?.memberSex === "M" ? (
                "남자"
              ) : (
                "여자"
              )
            ) : (
              <Form.Item
                name={"memberSex"}
                initialValue={""}
                rules={[{ required: true }]}
                noStyle
              >
                <Select
                  options={[
                    { value: "", label: "선택" },
                    { value: "M", label: "남자" },
                    { value: "F", label: "여자" },
                  ]}
                  style={{
                    width: "25%",
                  }}
                />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="전화번호" span={2}>
            {type === "detail" ? (
              detailData?.memberPhone?.replace(
                /^(\d{3})(\d{3,4})(\d{4})$/,
                "$1-$2-$3"
              )
            ) : (
              <Form.Item name={"memberPhone"} noStyle>
                <Input
                  style={{ width: "50%" }}
                  maxLength={20}
                  placeholder="'-' 생략 후 입력해주세요."
                />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="주소" span={3}>
            {type === "detail" ? (
              detailData?.memberAddr
            ) : (
              <Form.Item name={"memberAddr"} noStyle>
                <Input style={{ width: "70%" }} maxLength={100} />
              </Form.Item>
            )}
          </Descriptions.Item>
          {type === "detail" && (
            <>
              <Descriptions.Item label="최초 등록일자">
                {dayjs(detailData?.regDate).format("YYYY-MM-DD")}
              </Descriptions.Item>
              <Descriptions.Item label="상태" span={2}>
                {detailData?.startDate !== null ? (
                  <Badge status="processing" text="활성화" />
                ) : (
                  <Badge status="warning" text="비활성화" />
                )}
              </Descriptions.Item>
            </>
          )}
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
            <Button type="primary" onClick={onDetail} loading={loading}>
              취소
            </Button>
          )}
          <Button type="primary" onClick={onList} loading={loading}>
            목록
          </Button>
        </div>
      </Form>
      {/* Tab Area */}
      {type === "detail" && (
        <Tabs
          defaultActiveKey="payHistory"
          type="card"
          size={"small"}
          style={{ margin: "40px 0 32px 0" }}
          items={[
            {
              label: "결제 내역",
              key: "payHistory",
              children: (
                <>
                  <Table
                    dataSource={payHistory?.list}
                    columns={[
                      {
                        title: "결제 금액",
                        render: (_, record) => (
                          <>
                            {`${record?.phPrice}`.replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              ","
                            )}
                          </>
                        ),
                      },
                      {
                        title: "결제 일자",
                        render: (_, record) => (
                          <>{dayjs(record?.regDate).format("YYYY-MM-DD")}</>
                        ),
                      },
                    ]}
                    rowKey={(data: any) => data?.phSeq}
                    pagination={false}
                    scroll={{ y: 47 * 5 }}
                  />
                </>
              ),
            },
            {
              label: "방문 기록",
              key: "visitHistory",
              children: (
                <>
                  <Table
                    dataSource={visitHistory?.list}
                    columns={[
                      {
                        title: "방문 일자",
                        render: (_, record) => (
                          <>{dayjs(record?.regDate).format("YYYY-MM-DD")}</>
                        ),
                      },
                    ]}
                    rowKey={(data: any) => data?.vhSeq}
                    pagination={false}
                    scroll={{ y: 47 * 5 }}
                  />
                </>
              ),
            },
          ]}
          onChange={onChange}
        />
      )}
    </>
  );
};

export default MemberListForm;
