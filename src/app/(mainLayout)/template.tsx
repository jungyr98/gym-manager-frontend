"use client";

import { useState, useEffect, Component, Suspense } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  TeamOutlined,
  MailOutlined,
  BarChartOutlined,
  CalendarOutlined,
  InboxOutlined,
  BoxPlotFilled,
  AlignRightOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  theme,
  Breadcrumb,
  Typography,
  Tag,
  Popover,
} from "antd";
import type { MenuProps } from "antd";
import "./layout.css";
import Link from "next/link";
import type { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useRecoilState } from "recoil";
import { selectedMenuKeysState } from "../../store/global";
import Loading from "../../component/loading/loading";

const { Header, Sider, Content } = Layout;
type MenuItem = Required<MenuProps>["items"][number];
type Props = {
  children: React.ReactNode;
};

/**
 * 기본 레이아웃
 * used Ant Design
 * @returns
 */
const DefaultLayout = ({ children }: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [location, setLocation] = useState<any>({});
  const [selectedMenuKeys, setSelectedMenuKeys] = useRecoilState(
    selectedMenuKeysState
  ); // 선택된 메뉴 키

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }

  // Left Menu Data Setting
  const items: MenuItem[] = [
    getItem(
      <Link href={`/workplace/1/dashboard`}>Dashboard</Link>,
      "Dashboard",
      <HomeOutlined />
    ),
    getItem("회원 관리", "회원 관리", <TeamOutlined />, [
      getItem(
        <Link href={`/workplace/1/member/list`}>회원 목록</Link>,
        "회원 목록"
      ),
      getItem(
        <Link href={`/workplace/1/member/pay`}>결제 내역</Link>,
        "결제 내역"
      ),
    ]),
    getItem(
      <Link href={`/workplace/1/membership`}>회원권 관리</Link>,
      "회원권 관리",
      <CalendarOutlined />
    ),
    getItem(
      <Link href={`/workplace/1/calendar`}>일정 관리</Link>,
      "일정 관리",
      <CalendarOutlined />
    ),
    getItem(
      <Link href={`/workplace/1/item`}>재고 관리</Link>,
      "재고 관리",
      <InboxOutlined />
    ),
    getItem(
      <Link href={`/workplace/1/message`}>메시지 관리</Link>,
      "메시지 관리",
      <MailOutlined />
    ),
    getItem("통계", "통계", <BarChartOutlined />, [
      getItem(
        <Link href={`/workplace/1/chart/visit`}>방문 통계</Link>,
        "방문 통계"
      ),
      getItem(
        <Link href={`/workplace/1/chart/sales`}>매출 통계</Link>,
        "매출 통계"
      ),
    ]),
  ];

  const content = (
    <div>
      <p>로그아웃</p>
    </div>
  );

  // 메뉴 클릭 이벤트 (브레드크럼 이벤트)
  const fn_onMenu: MenuProps["onClick"] = (e) => {
    setSelectedMenuKeys(e?.keyPath);
    // 메뉴 경로 reverse
    let deepCopy = [...e.keyPath];
    const result = deepCopy?.reverse().map((path) => {
      return { title: path };
    });
    setLocation(result);
  };

  useEffect(() => {
    let deepCopy = [...selectedMenuKeys];
    const result = deepCopy?.reverse().map((nodeItem) => {
      return { title: nodeItem };
    });
    setLocation(result);
  }, []);

  return (
    <Layout>
      {/* 사이드 메뉴 */}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        {/* 로고 */}
        <div className="demo-logo-vertical">{/* <BoxPlotFilled /> */}</div>
        {/* 카테고리 */}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["Dashboard"]}
          defaultOpenKeys={["회원 관리", "통계"]}
          selectedKeys={selectedMenuKeys}
          items={items}
          onClick={fn_onMenu}
        />
      </Sider>
      <Layout>
        {/* 헤더 */}
        <Header style={{ padding: "0 20px 0 0", background: colorBgContainer }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {/* Left Menu 최소화 */}
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            {/* 로그인 유저 프로필 */}
            <div>
              <Tag color="success">ON</Tag>
              <Typography.Text>제이복싱짐 홍길동님</Typography.Text>
              <Popover
                placement="bottomRight"
                title={""}
                content={content}
                trigger="click"
              >
                <Button
                  icon={<CaretDownOutlined />}
                  style={{ border: "none", boxShadow: "none" }}
                ></Button>
              </Popover>
            </div>
          </div>
        </Header>
        {/* 컨텐츠 */}
        <Suspense fallback={<Loading />}>
          <Content style={{ margin: "0 16px" }}>
            {/* Location */}
            <Breadcrumb
              style={{ margin: "16px 0" }}
              items={location}
            ></Breadcrumb>
            {/* Component */}
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              {children}
            </div>
          </Content>
        </Suspense>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
