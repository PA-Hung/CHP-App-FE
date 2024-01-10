import { useEffect, useState } from "react";
import { Table, Button, notification, Popconfirm, message } from "antd";
import queryString from "query-string";
import { deleteAccommodation, getAccommodation } from "../../utils/api";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import { useSelector } from "react-redux";
import UpdateModal from "./update.modal";

const AccommodationTable = (props) => {
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

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 50,
      align: "center",
      render: (text, record, index) => {
        return <>{index + 1 + (meta.current - 1) * meta.pageSize}</>;
      },
      hideInSearch: true,
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
    },
    // {
    //   title: "Ngày sinh",
    //   dataIndex: "birthday",
    //   key: "birthday",
    //   render: (_value, record) => {
    //     return <div>{dayjs(record.birthday).format("DD/MM/YYYY")}</div>;
    //   },
    // },
    {
      title: "CMND/CCCD",
      dataIndex: "identification_number",
      key: "identification_number",
    },
    {
      title: "Hộ chiếu",
      dataIndex: "passport",
      key: "passport",
    },
    {
      title: "Quốc tịch",
      dataIndex: "nationality",
      key: "nationality",
    },
    {
      title: "Quốc gia",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Loại cư trú",
      dataIndex: "residential_status",
      key: "residential_status",
    },
    {
      title: "Ngày đến",
      dataIndex: "arrival",
      key: "arrival",
      render: (_value, record) => {
        return <div>{dayjs(record.arrival).format("DD/MM/YYYY")}</div>;
      },
    },
    {
      title: "Actions",
      render: (record) => {
        return (
          <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
            <div>
              <Button
                danger
                onClick={() => {
                  setIsUpdateModalOpen(true);
                  setUpdateData(record);
                }}
              >
                Cập nhật
              </Button>
            </div>
            <div>
              <Popconfirm
                title={`Bạn muốn xoá ${record.name} không ?`}
                onConfirm={() => confirmDelete(record)}
                okText="Yes"
                cancelText="No"
              >
                <Button type={"primary"} danger>
                  Xoá
                </Button>
              </Popconfirm>
            </div>
          </div>
        );
      },
    },
  ];

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

  return (
    <>
      <Table
        size="small"
        scroll={{ x: true }}
        columns={columns}
        dataSource={listAccommodation}
        rowKey={"_id"}
        loading={loading}
        bordered={true}
        pagination={{
          position: ["bottomCenter"],
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
          showTotal: (total, range) =>
            `${range[0]} - ${range[1]} of ${total} items`,
          onChange: (page, pageSize) => handleOnchangeTable(page, pageSize),
          showSizeChanger: true,
          defaultPageSize: meta.pageSize,
        }}
      />
      <UpdateModal
        updateData={updateData}
        getData={getData}
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        setUpdateData={setUpdateData}
      />
    </>
  );
};

export default AccommodationTable;
