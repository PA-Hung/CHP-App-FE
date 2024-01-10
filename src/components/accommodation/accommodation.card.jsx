import { useEffect, useState } from "react";
import {
  Collapse,
  notification,
  message,
  Form,
  Card,
  Flex,
  Spin,
  Pagination,
  Button,
  Popconfirm,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import queryString from "query-string";
import { deleteAccommodation, getAccommodation } from "../../utils/api";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import { useSelector } from "react-redux";
import UpdateModal from "./update.modal";

const AccommodationCard = (props) => {
  const { listAccommodation, setListAccommodation, loading, setLoading } =
    props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 15,
    pages: 0,
    total: 0,
  });
  const isAdmin = useSelector((state) => state.auth.user.role);
  const user = useSelector((state) => state.auth.user);
  //const userId = isAdmin !== "ADMIN" ? user : "";

  useEffect(() => {
    getData();
  }, [meta.current, meta.pageSize]);

  const getData = async () => {
    const query = buildQuery();
    setLoading(true);
    const res = await getAccommodation(query);
    if (res.data) {
      setListAccommodation(res.data.result);
      setMeta({
        current: res?.data?.meta?.current,
        pageSize: res?.data?.meta?.pageSize,
        pages: res.data.meta.pages,
        total: res.data.meta.total,
      });
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: res.message,
      });
    }
    setLoading(false);
  };

  const confirmDelete = async (user) => {
    const res = await deleteAccommodation(user._id);
    if (res.data) {
      await getData();
      message.success("Xoá lưu trú thành công !");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: res.message,
      });
    }
  };

  const handleOnchangeTable = (page, pageSize) => {
    setMeta({
      current: page,
      pageSize: pageSize,
      pages: meta.pages,
      total: meta.total,
    });
  };

  const buildQuery = (
    params,
    sort,
    filter,
    page = meta.current,
    pageSize = meta.pageSize
  ) => {
    const clone = { ...params };
    if (isAdmin !== "ADMIN") {
      if (user?._id) clone.userId = `/${user._id}/i`;
    }
    if (clone.phone) clone.phone = `/${clone.phone}/i`;
    if (clone.name) clone.name = `/${clone.name}/i`;
    if (clone.passport) clone.passport = `/${clone.passport}/i`;
    if (clone.identification_number)
      clone.identification_number = `/${clone.identification_number}/i`;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.userId) {
      sortBy = sort.userId === "ascend" ? "sort=userId" : "sort=-userId";
    }
    if (sort && sort.phone) {
      sortBy = sort.phone === "ascend" ? "sort=phone" : "sort=-phone";
    }
    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
    }
    if (sort && sort.passport) {
      sortBy = sort.passport === "ascend" ? "sort=passport" : "sort=-passport";
    }
    if (sort && sort.identification_number) {
      sortBy =
        sort.identification_number === "ascend"
          ? "sort=identification_number"
          : "sort=-identification_number";
    }

    if (sort && sort.createdAt) {
      sortBy =
        sort.createdAt === "ascend" ? "sort=createdAt" : "sort=-createdAt";
    }
    if (sort && sort.updatedAt) {
      sortBy =
        sort.updatedAt === "ascend" ? "sort=updatedAt" : "sort=-updatedAt";
    }

    //mặc định sort theo updatedAt
    if (Object.keys(sortBy).length === 0) {
      temp = `current=${page}&pageSize=${pageSize}&${temp}&sort=-updatedAt`;
    } else {
      temp = `current=${page}&pageSize=${pageSize}&${temp}&${sortBy}`;
    }
    return temp;
  };

  const { Meta } = Card;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div>
        {loading ? (
          <div>
            <Spin size="default" />
          </div>
        ) : (
          <Flex wrap="wrap" gap="small">
            {listAccommodation.map((item) => (
              <Card
                hoverable
                key={item._id}
                style={{ width: 300, margin: "10px" }}
              >
                <Meta title={item.name} />

                <hr />
                <p>CMND/CCCD : {item.identification_number}</p>
                <p>Hộ chiếu : {item.passport}</p>
                <p>Quốc tịch : {item.nationality}</p>
                <p>Quốc gia : {item.country}</p>
                <p>Loại cư trú : {item.residential_status}</p>
                <p>Ngày đến : {dayjs(item.arrival).format("DD/MM/YYYY")}</p>
                <Collapse
                  accordion
                  items={[
                    {
                      key: "1",
                      label: (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            alignContent: "center",
                            gap: 10,
                          }}
                        >
                          <div>Xem chi tiêt</div>
                          <div style={{ display: "flex", gap: 5 }}>
                            <Popconfirm
                              title={`Bạn muốn xoá ${item.name} không ?`}
                              onConfirm={() => confirmDelete(item)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button icon={<DeleteOutlined />} danger />
                            </Popconfirm>
                            <Button
                              icon={<EditOutlined />}
                              onClick={() => {
                                setIsUpdateModalOpen(true);
                                setUpdateData(item);
                              }}
                            />
                          </div>
                        </div>
                      ),
                      children: (
                        <>
                          <p>
                            Ngày sinh :{" "}
                            {dayjs(item.birthday).format("DD/MM/YYYY")}
                          </p>
                          <p>Giới tính : {item.gender}</p>
                          <p>Giấy tờ khác : {item.documents}</p>
                          <p>Điện thoại : {item.phone}</p>
                          <p>Nghề nghiệp : {item.job}</p>
                          <p>Nơi làm việc : {item.workplace}</p>
                          <p>Dân tộc : {item.ethnicity}</p>
                          <p>Tỉnh thành : {item.province}</p>
                          <p>Quận huyện : {item.district}</p>
                          <p>Phường xã : {item.ward}</p>
                          <p>Địa chỉ : {item.address}</p>
                          <p>
                            Ngày đi :{" "}
                            {dayjs(item.departure).format("DD/MM/YYYY")}
                          </p>
                          <p>Lý do lưu trú : {item.reason}</p>
                          <p>Mã căn hộ : {item.apartment}</p>
                        </>
                      ),
                    },
                  ]}
                />
              </Card>
            ))}
          </Flex>
        )}
      </div>
      <div style={{ textAlign: "center" }}>
        <Pagination
          current={meta.current}
          total={meta.total}
          pageSize={meta.pageSize}
          onChange={(page, pageSize) => handleOnchangeTable(page, pageSize)}
          showSizeChanger={true}
          defaultPageSize={meta.pageSize}
        />
        <UpdateModal
          updateData={updateData}
          getData={getData}
          isUpdateModalOpen={isUpdateModalOpen}
          setIsUpdateModalOpen={setIsUpdateModalOpen}
          setUpdateData={setUpdateData}
        />
      </div>
    </div>
  );
};

export default AccommodationCard;
