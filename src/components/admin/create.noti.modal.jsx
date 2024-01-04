import { Modal, Input, notification, Form, Select } from "antd";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { postCreateNoti } from "@/utils/api";

const CreateNotiModal = (props) => {
  const { getData, isCreateModalOpen, setIsCreateModalOpen } = props;
  const [value, setValue] = useState("");
  const [form] = Form.useForm();

  const resetModal = () => {
    setIsCreateModalOpen(false);
    form.resetFields();
  };

  const onFinish = async () => {
    const data = { description: value };
    const res = await postCreateNoti(data);
    if (res.data) {
      await getData();
      notification.success({
        message: "Thêm thông báo thành công !",
        placement: "top",
      });
      resetModal();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        placement: "top",
        description: res.message,
      });
    }
  };

  return (
    <>
      <Modal
        title="Thêm mới thông báo"
        open={isCreateModalOpen}
        onOk={() => form.submit()}
        onCancel={resetModal}
        maskClosable={false}
      >
        <Form
          name="create-new-Noti"
          onFinish={onFinish}
          layout="vertical"
          form={form}
        >
          <Form.Item>
            <Form.Item>
              <ReactQuill
                theme="snow"
                value={value}
                onChange={setValue}
                style={{
                  width: "100%",
                  height: "250px",
                }}
                // modules={{
                //   toolbar: [
                //     ["bold", "italic", "underline", "strike"], // toggled buttons
                //     ["blockquote", "code-block"],
                //     [{ header: 1 }, { header: 2 }], // custom button values
                //     [{ list: "ordered" }, { list: "bullet" }],
                //     [{ script: "sub" }, { script: "super" }], // superscript/subscript
                //     [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
                //     [{ direction: "rtl" }], // text direction
                //     [{ size: ["small", false, "large", "huge"] }], // custom dropdown
                //     [{ header: [1, 2, 3, 4, 5, 6, false] }],
                //     [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                //     [{ font: [] }],
                //     [{ align: [] }],
                //     ["clean"], // remove formatting button
                //   ],
                // }}
              />
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateNotiModal;
