import { useEffect, useState } from "react";
import {
  Table,
  Button,
  notification,
  Popconfirm,
  message,
  Form,
  Input,
  Upload,
  Row,
  Col,
} from "antd";
import queryString from "query-string";
import {
  PlusOutlined,
  SearchOutlined,
  ImportOutlined,
  DownloadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  deleteAccommodation,
  exportExcel,
  getAccommodation,
  importExcel,
} from "../../utils/api";
import CreateModal from "./create.modal";
import UpdateModal from "./update.modal";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import SearchModal from "./search.modal";

const AccommodationTable = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [listAccommodation, setListAccommodation] = useState([]);
  const [updateData, setUpdateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 15,
    pages: 0,
    total: 0,
  });
  const isAdmin = useSelector((state) => state.auth.user.role);
  const user = useSelector((state) => state.auth.user);
  //const userId = isAdmin !== "ADMIN" ? user : "";

  const [loadingUpload, setLoadingUpload] = useState(false);

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

  const [form] = Form.useForm();

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

  const onSearch = async (value) => {
    const query = buildQuery(value);
    setLoading(true);
    const res = await getAccommodation(query);
    if (res.data) {
      setListAccommodation(res.data.result);
      setMeta({
        current: res.data.meta.current,
        pageSize: res.data.meta.pageSize,
        pages: res.data.meta.pages,
        total: res.data.meta.total,
      });
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
    setLoading(false);
  };

  const beforeUpload = (file) => {
    const isXLSX =
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (!isXLSX) {
      message.error(`${file.name} không phải là file excel`);
    }
    return isXLSX || Upload.LIST_IGNORE;
  };

  const handleUploadFileExcel = async ({ file }) => {
    const response = await importExcel(file, "fileExcel");
    if (response.statusCode === 201) {
      message.success(response.data.message);
      setLoadingUpload(false);
      getData();
    } else {
      message.error(response.data.message);
    }
  };

  const handleExport = async () => {
    try {
      const response = await exportExcel();
      if (response.statusCode === 200) {
        // Chuyển đổi Buffer thành ArrayBuffer
        // Chuyển đổi dữ liệu JSON thành worksheet của workbook
        const ws = XLSX.utils.json_to_sheet(response.data);

        // Tạo workbook và append worksheet vào đó
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

        // Tạo tệp Excel và tải về
        XLSX.writeFile(wb, "exported_data.xlsx");
      }
    } catch (error) {
      console.error("Export error:", error);
      // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi
    }
  };

  return (
    <div style={{ paddingLeft: 30, paddingRight: 30 }}>
      <div
        style={{
          color: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 20,
        }}
      >
        <div>
          <Button
            icon={<SearchOutlined />}
            onClick={() => setIsSearchModalOpen(true)}
          >
            Tìm kiếm
          </Button>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          <Button
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Thêm mới
          </Button>
          <Upload
            maxCount={1}
            multiple={false}
            showUploadList={false}
            beforeUpload={beforeUpload}
            customRequest={handleUploadFileExcel}
          >
            <Button
              icon={loadingUpload ? <LoadingOutlined /> : <ImportOutlined />}
            >
              Import Excel
            </Button>
          </Upload>
          <Button icon={<DownloadOutlined />} onClick={() => handleExport()}>
            Export Excel
          </Button>
        </div>
      </div>
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

      <CreateModal
        getData={getData}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />
      <UpdateModal
        updateData={updateData}
        getData={getData}
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        setUpdateData={setUpdateData}
      />
      <SearchModal
        isSearchModalOpen={isSearchModalOpen}
        setIsSearchModalOpen={setIsSearchModalOpen}
        onSearch={onSearch}
      />
    </div>
  );
};

export default AccommodationTable;
