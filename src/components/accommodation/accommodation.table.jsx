import { useEffect, useState } from "react";
import { Table, Button, notification, Popconfirm, message } from "antd";
import { deleteAccommodation, getAccommodation } from "../../utils/api";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import UpdateModal from "./update.modal";

const AccommodationTable = (props) => {
  const { listAccommodation, loading, getData } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 15,
    pages: 0,
    total: 0,
  });

  useEffect(() => {
    getData();
  }, [meta.current, meta.pageSize]);

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
