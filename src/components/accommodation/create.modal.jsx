import {
  Modal,
  Input,
  notification,
  Form,
  message,
  DatePicker,
  Select,
} from "antd";
import { postCreateAccommodation } from "../../utils/api";
import { useEffect, useState } from "react";

const CreateModal = (props) => {
  const { getData, isCreateModalOpen, setIsCreateModalOpen } = props;
  const [form] = Form.useForm();

  const resetModal = () => {
    setIsCreateModalOpen(false);
    form.resetFields();
  };

  const [IdentificationNumber, setIdentificationNumber] = useState(false);
  const [Passport, setPassport] = useState(false);
  const [Documents, setDocuments] = useState(false);

  const checkField = () => {
    const { getFieldValue } = form;

    const identification_number = getFieldValue("identification_number");
    const passport = getFieldValue("passport");
    const documents = getFieldValue("documents");

    if (identification_number || passport || documents) {
      setIdentificationNumber(false);
      setPassport(false);
      setDocuments(false);
    } else {
      setIdentificationNumber(true);
      setPassport(true);
      setDocuments(true);
    }
    return Promise.resolve();
  };

  useEffect(() => {
    checkField;
  }, [form]);

  const onFinish = async (values) => {
    // const { name, phone } = values;
    // const data = { name, phone };
    const data = values; // viết gọn của 2 dòng trên
    const res = await postCreateAccommodation(data);
    if (res.data) {
      await getData();
      message.success("Tạo mới lưu trú thành công !");
      resetModal();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: res.message,
      });
    }
  };
  9;

  return (
    <>
      <Modal
        title="Thêm mới thông tin lưu trú"
        open={isCreateModalOpen}
        onOk={() => form.submit()}
        onCancel={resetModal}
        maskClosable={false}
        width={"70%"}
      >
        <Form
          name="create-new-accommodation"
          onFinish={onFinish}
          layout="vertical"
          form={form}
        >
          <Form.Item
            label="Họ tên"
            name="name"
            rules={[{ required: true, message: "Nhập họ tên !" }]}
            style={{
              display: "inline-block",
              width: "calc(20% - 5px)",
              marginRight: 5,
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="birthday"
            label="Ngày sinh"
            rules={[{ required: true, message: "Chọn ngày sinh !" }]}
            style={{
              display: "inline-block",
              width: "calc(20% - 5px)",
              marginRight: 5,
            }}
          >
            <DatePicker
              placeholder="Chọn ngày"
              style={{ width: "100%" }}
              format={"DD/MM/YYYY"}
            />
          </Form.Item>
          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: "Chọn giới tính !" }]}
            style={{
              display: "inline-block",
              width: "calc(20% - 5px)",
              marginRight: 5,
            }}
          >
            <Select
              placeholder="Chọn giới tính"
              allowClear
              options={[
                { value: "Nam", label: "Nam" },
                { value: "Nữ", label: "Nữ" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="CMND/CCCD"
            name="identification_number"
            rules={[{ required: true, validator: checkField }]}
            validateStatus={IdentificationNumber ? "error" : ""}
            help={IdentificationNumber ? "Bạn phải điền CMND/CCCD !" : ""}
            style={{
              display: "inline-block",
              width: "calc(20% - 5px)",
              marginRight: 5,
            }}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="Hộ chiếu"
            name="passport"
            rules={[{ required: true, validator: checkField }]}
            validateStatus={Passport ? "error" : ""}
            help={Passport ? "Bạn phải điền Passport !" : ""}
            style={{
              display: "inline-block",
              width: "calc(20% - 5px)",
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Giấy tờ khác"
            rules={[{ required: true, validator: checkField }]}
            name="documents"
            validateStatus={Documents ? "error" : ""}
            help={Documents ? "Bạn phải điền giấy tờ khác !" : ""}
            style={{
              display: "inline-block",
              width: "calc(20% - 5px)",
              marginRight: 5,
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Điện thoại"
            name="phone"
            style={{
              display: "inline-block",
              width: "calc(20% - 5px)",
              marginRight: 5,
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nghề nghiệp"
            name="job"
            style={{
              display: "inline-block",
              width: "calc(20% - 5px)",
              marginRight: 5,
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nơi làm việc"
            name="workplace"
            style={{
              display: "inline-block",
              width: "calc(20% - 5px)",
              marginRight: 5,
            }}
          >
            <Input maxLength={200} />
          </Form.Item>
          <Form.Item
            label="Dân tộc"
            name="ethnicity"
            style={{
              display: "inline-block",
              width: "calc(20% - 5px)",
              marginRight: 5,
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Quốc tịch"
            name="nationality"
            rules={[{ required: true, message: "Nhập quốc tịch !" }]}
            style={{
              display: "inline-block",
              width: "calc(20% - 5px)",
              marginRight: 5,
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Quốc gia"
            name="country"
            rules={[{ required: true, message: "Nhập quốc gia !" }]}
            style={{
              display: "inline-block",
              width: "calc(20% - 5px)",
              marginRight: 5,
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tỉnh thành"
            name="province"
            style={{
              display: "inline-block",
              width: "calc(20% - 5px)",
              marginRight: 5,
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Quận huyện"
            name="district"
            style={{
              display: "inline-block",
              width: "calc(20% - 5px)",
              marginRight: 5,
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phường xã"
            name="ward"
            style={{
              display: "inline-block",
              width: "calc(20% - 5px)",
              marginRight: 5,
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số nhà"
            name="address"
            style={{
              display: "inline-block",
              width: "calc(20% - 5px)",
              marginRight: 5,
            }}
          >
            <Input maxLength={400} />
          </Form.Item>
          <Form.Item
            label="Loại cư trú"
            name="residential_status"
            rules={[{ required: true, message: "Nhập loại cư trú !" }]}
            style={{
              display: "inline-block",
              width: "calc(20% - 5px)",
              marginRight: 5,
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ngày đến"
            name="arrival"
            rules={[{ required: true, message: "Chọn ngày đến !" }]}
            style={{
              display: "inline-block",
              width: "calc(20% - 5px)",
              marginRight: 5,
            }}
          >
            <DatePicker
              placeholder="Chọn ngày"
              style={{ width: "100%" }}
              format={"DD/MM/YYYY"}
            />
          </Form.Item>
          <Form.Item
            label="Ngày đi"
            name="departure"
            style={{
              display: "inline-block",
              width: "calc(20% - 5px)",
              marginRight: 5,
            }}
          >
            <DatePicker
              placeholder="Chọn ngày"
              style={{ width: "100%" }}
              format={"DD/MM/YYYY"}
            />
          </Form.Item>
          <Form.Item
            label="Lý do lưu trú"
            name="reason"
            style={{
              display: "inline-block",
              width: "calc(20% - 5px)",
              marginRight: 5,
            }}
          >
            <Input maxLength={250} />
          </Form.Item>
          <Form.Item
            label="Mã căn hộ"
            name="apartment"
            style={{
              display: "inline-block",
              width: "calc(20% - 5px)",
              marginRight: 5,
            }}
          >
            <Input maxLength={250} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateModal;
