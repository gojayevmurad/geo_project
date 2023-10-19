import React, { useEffect, useState } from "react";
import "./addNewData.scss";
import { Button, Input, Select } from "antd";

const AddNewData = ({
  setShow,
  addNewDataHandler,
  selectedItemData,
  changeGeoItem,
}) => {
  const [newData, setNewData] = useState({
    len: selectedItemData ? selectedItemData.len : "",
    status: selectedItemData ? selectedItemData.status : 0,
  });

  const statusOptions = [
    { value: 0, label: "0 : Some Text" },
    { value: 1, label: "1 : Some Text" },
    { value: 2, label: "2 : Some Text" },
  ];

  const closePopup = () => {
    setNewData({ len: "", status: "", wkt: "" });
    setShow(false);
  };
  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (selectedItemData) changeGeoItem({ ...selectedItemData, ...newData });
    else addNewDataHandler(newData);

    closePopup();
  };
  const onChangeHandler = (e) =>
    setNewData({ ...newData, [e.target.name]: e.target.value });

  return (
    <div className="new-data-popup">
      <div onMouseDown={closePopup} className="overlay"></div>
      <div className="content">
        <form onSubmit={onSubmitHandler} className="new_data_form">
          <div className="header">
            <h3>Add new data</h3>
          </div>
          <label>
            <p>
              Enter Len Data: <span className="red-text">*</span>
            </p>
            <Input name="len" value={newData.len} onChange={onChangeHandler} />
          </label>
          <label>
            <p>
              Select Status: <span className="red-text">*</span>
            </p>
            <Select
              onChange={(value) => setNewData({ ...newData, status: value })}
              value={newData.status}
              placeholder="Select status"
              options={statusOptions}
            />
          </label>
          <div className="actions">
            <Button onClick={closePopup} danger type="primary">
              Cancel
            </Button>
            <Button onClick={onSubmitHandler} type="primary">
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewData;
