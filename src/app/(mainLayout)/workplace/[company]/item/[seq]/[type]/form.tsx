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
} from "antd";
import { useForm } from "antd/es/form/Form";
import type { DescriptionsProps, TabsProps } from "antd";
import ko from "antd/es/date-picker/locale/ko_KR";
import dayjs from "dayjs";
import { useRouter, useParams } from "next/navigation";

const result = {
  goodsName: "노바 복싱 글러브 8oz",
  goodsPrice: "30,000",
  goodsQuantity: 20,
  regDate: "2022-10-01",
};

const GoodsForm = () => {
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
    router.push(`/workplace/${company}/item`);
  };

  // 상세 화면 진입
  const onDetail = () => {
    if (!window.confirm("수정을 취소하시겠습니까?")) {
      return false;
    }
    router.push(`/workplace/${company}/item/${seq}/detail`);
  };

  // 수정 화면 진입
  const onUpdate = () => {
    router.push(`/workplace/${company}/item/${seq}/update`);
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

    router.push(`/workplace/${company}/item/detail/${seq}`);
  };

  useEffect(() => {
    console.log(type);
    if (type === "update") {
      form.setFieldsValue({
        goodsName: detailData?.goodsName,
        goodsPrice: detailData?.goodsPrice,
        goodsQuantity: detailData?.goodsQuantity,
        regDate: dayjs(detailData?.regDate),
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
        <Descriptions title="제품 정보" bordered>
          <Descriptions.Item label="제품명">
            {type === "detail" ? (
              "노바 복싱 글러브 8oz"
            ) : (
              <Form.Item name={"goodsName"} noStyle>
                <Input style={{ width: "70%" }} />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="제품 가격" span={2}>
            {type === "detail" ? (
              "30,000"
            ) : (
              <Form.Item name={"goodsPrice"} noStyle>
                <Input style={{ width: "40%" }} />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="제품 수량">
            {type === "detail" ? (
              20
            ) : (
              <Form.Item name={"goodsQuantity"} noStyle>
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="등록일자">
            {type === "detail" ? (
              "2022-10-01"
            ) : (
              <Form.Item name={"regDate"} noStyle>
                <DatePicker
                  picker="date"
                  style={{ width: "50%" }}
                  locale={ko}
                />
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

export default GoodsForm;
