import { useEffect } from "react";
import {
  Modal,
  Input,
  notification,
  Form,
  Select,
  InputNumber,
  message,
} from "antd";
import { updateAccommodation } from "../../utils/api";

const UpdateModal = (props) => {
  const {
    updateData,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    getData,
    setUpdateData,
  } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (updateData) {
      form.setFieldsValue({
        name: updateData.name,
        phone: updateData.phone,
      });
    }
  }, [updateData]);

  const onFinish = async (values) => {
    const { name, phone } = values;
    const data = {
      _id: updateData?._id,
      name,
      phone,
    };

    const res = await updateAccommodation(data);
    if (res.data) {
      await getData();
      message.success("Cập nhật quay phim thành công !");
      resetModal();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: res.message,
      });
    }
  };

  const resetModal = () => {
    setIsUpdateModalOpen(false);
    setUpdateData(null);
    form.resetFields();
  };

  return (
    <>
      <Modal
        title="Cập nhật quay phim"
        open={isUpdateModalOpen}
        onOk={() => form.submit()}
        onCancel={resetModal}
        maskClosable={false}
        width={350}
      >
        <Form
          name="update-camera-man"
          onFinish={onFinish}
          layout="vertical"
          form={form}
        >
          <Form.Item>
            <Form.Item
              label="Tên quay phim"
              name="name"
              rules={[{ required: true, message: "Nhập tên quay phim !" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true, message: "Nhập số điện thoại !" }]}
            >
              <Input />
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateModal;
