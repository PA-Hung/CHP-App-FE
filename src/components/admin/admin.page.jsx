import React, { useEffect, useState } from "react";
import { Alert, Button, notification } from "antd";
import CreateNotiModal from "./create.noti.modal";
import {
  NotificationFilled,
  NotificationOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { getNoti } from "@/utils/api";
import { deleteNoti } from "../../utils/api";
import { useSelector } from "react-redux";
import UpdateNotiModal from "./update.noti.modal";

const AdminPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [noti, setNoti] = useState([]);
  const [loading, setLoading] = useState(false);
  const role = useSelector((state) => state.auth.user.role);

  useEffect(() => {
    getData();
  }, [noti]);

  const getData = async () => {
    setLoading(true);
    const res = await getNoti();
    if (res.data) {
      setNoti(res.data.description);
    } else {
      setNoti(null);
    }
    setLoading(false);
  };

  const deleteNotification = async () => {
    const res = await deleteNoti();
    if (res.data) {
      await getData();
      notification.success({
        message: "Xoá thông báo thành công !",
        placement: "top",
      });
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
      {noti ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "black",
              paddingTop: 20,
              gap: 5,
            }}
          >
            <Alert
              message="Thông báo :"
              description={<div dangerouslySetInnerHTML={{ __html: noti }} />}
              type="warning"
              showIcon
              loading={loading}
            />
            {role === "ADMIN" ? (
              <>
                <Button
                  size="small"
                  type="dashed"
                  icon={<NotificationOutlined />}
                  style={{ fontWeight: "bolder" }}
                  onClick={() => setIsUpdateModalOpen(true)}
                />
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  style={{ fontWeight: "bolder" }}
                  onClick={() => deleteNotification()}
                />
              </>
            ) : (
              ""
            )}
          </div>
        </>
      ) : (
        <>
          {role === "ADMIN" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "black",
                paddingTop: 20,
                gap: 5,
              }}
            >
              <Button
                size="small"
                type={"primary"}
                icon={<NotificationFilled />}
                style={{ fontWeight: "bolder" }}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Thêm thông báo
              </Button>
            </div>
          ) : (
            ""
          )}
        </>
      )}

      <CreateNotiModal
        getData={getData}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />
      <UpdateNotiModal
        noti={noti}
        getData={getData}
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        setNoti={setNoti}
      />
    </>
  );
};

export default AdminPage;
