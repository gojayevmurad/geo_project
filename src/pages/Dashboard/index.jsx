import React, { useState } from "react";

import * as XLSX from "xlsx";
import { ReactTabulator, reactFormatter } from "react-tabulator";
import { EditFilled, PushpinFilled, DeleteFilled } from "@ant-design/icons";
import { Button } from "antd";
import { toast } from "react-hot-toast";

import AddNewData from "../../components/AddNewData";
import DieChart from "../../components/DieChart";
import BarChart from "../../components/BarChart";
import Map from "../../components/Map";
import { drawWktFeature, removeLayer } from "../../components/Map/MapHelper";

import "react-tabulator/css/tabulator_bootstrap5.css";
import "./dashboard.scss";

const Dashboard = () => {
  const [map, setMap] = useState(null);
  // all geo locations data
  const [data, setData] = useState([]);

  const [filteredData, setFilteredData] = useState([]); // filtered data; look => dataFilteredHandler

  const [selectedItem, setSelectedItem] = useState(null);

  // show AddNewData component
  const [showNewDataPopup, setShowNewDataPopup] = useState(false);

  // show charts state
  const [showFirstAnalysis, setShowFirstAnalysis] = useState(false);
  const [showSecondAnalysis, setShowSecondAnalysis] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const formattedData = jsonData.slice(1).map((row) => {
        const [id, len, wkt, status] = row;
        return { id, len, wkt, status };
      });

      formattedData.sort((a, b) => b.id - a.id);
      setData(formattedData);
    };
    reader.readAsBinaryString(file);
  };
  //#region Single Geo Item Actions
  const addNewDataHandler = (newGeoLocationData) => {
    setData([{ ...newGeoLocationData, id: data.length + 1 }, ...data]);
  };
  const changeGeoItem = (changedGeoItem) => {
    const updatedData = data.map((item) =>
      item.id === changedGeoItem.id ? { ...item, ...changedGeoItem } : item
    );
    setData(updatedData);
    setSelectedItem(null);
  };
  const deleteGeoItemWithId = (id) => {
    setData(data.filter((geoItem) => geoItem.id != id));
    toast.error(`Item was deleted - ID: ${id}`);
  };
  const getGeoItemWithId = (id) => data.find((geoItem) => geoItem.id == id);
  //#endregion

  const columns = [
    {
      title: "ID",
      field: "id",
      width: 70,
      headerFilter: "input",
    },
    {
      title: "Len",
      field: "len",
      headerFilter: "input",
      width: 200,
    },
    {
      title: "Wkt",
      field: "wkt",
      headerFilter: "input",
    },
    {
      title: "Status",
      field: "status",
      width: 80,
      headerFilter: "input",
      headerSort: false,
    },
    {
      title: "Edit",
      field: "edit",
      width: 80,
      hozAlign: "center",
      formatter: reactFormatter(<EditBtn />),
      headerSort: false,
    },
    {
      title: "Delete",
      field: "delete",
      width: 80,
      hozAlign: "center",
      formatter: reactFormatter(<DeleteBtn />),
      headerSort: false,
    },
    {
      title: "Map",
      field: "map",
      width: 80,
      hozAlign: "center",
      formatter: reactFormatter(<MapBtn />),
      headerSort: false,
    },
  ];
  //#region Column Buttons
  function EditBtn(props) {
    const rowData = props.cell._cell.row.data;
    return (
      <Button
        onClick={() => {
          setSelectedItem(getGeoItemWithId(rowData.id));
          setShowNewDataPopup(true);
        }}
      >
        <EditFilled />
      </Button>
    );
  }

  function MapBtn(props) {
    const rowData = props.cell._cell.row.data;

    const onClickHandler = () => {
      const geoItem = getGeoItemWithId(rowData.id);
      removeLayer(map, "wktLayer");
      const value = geoItem.wkt;
      drawWktFeature(map, value);
    };
    return (
      <Button onClick={onClickHandler}>
        <PushpinFilled />
      </Button>
    );
  }

  function DeleteBtn(props) {
    const id = props.cell._cell.row.data.id;

    return (
      <Button onClick={() => deleteGeoItemWithId(id)}>
        <DeleteFilled />
      </Button>
    );
  }
  //#endregion

  const handleNewDataPopup = () => setShowNewDataPopup(!showNewDataPopup);

  // tabulator get filtered data event handler
  const dataFilteredHandler = (filters, rows) => {
    setShowFirstAnalysis(false);
    setShowSecondAnalysis(false);
    if (filters.length == 0) return;

    setFilteredData(
      rows.map((geoItem) => {
        const rowData = geoItem._row.data;
        return {
          id: rowData.id,
          len: rowData.len,
          status: rowData.status,
          wkt: rowData.wkt,
        };
      })
    );
  };

  return (
    <div className="dashboard_page">
      <div className="container">
        {showNewDataPopup && (
          <AddNewData
            setShow={setShowNewDataPopup}
            addNewDataHandler={addNewDataHandler}
            selectedItemData={selectedItem}
            changeGeoItem={changeGeoItem}
          />
        )}
        <div className="content">
          <div className="content--header">
            <label htmlFor="file-input" className="load_file">
              <Button type="primary">Load Excel File</Button>
              <input
                id="file-input"
                accept=".xlsx"
                type="file"
                onChange={handleFileUpload}
              />
            </label>
            <Button onClick={handleNewDataPopup}>Add New Data</Button>
          </div>
          <div className="content--body">
            <div className="content--body__table">
              <ReactTabulator
                columns={columns}
                data={data}
                options={{
                  pagination: true,
                  paginationSize: 8,
                  placeholder: "No Data Set",
                }}
                events={{
                  dataFiltered: dataFilteredHandler,
                }}
              />
              <div className="analysis">
                <Button
                  onClick={() => setShowFirstAnalysis(!showFirstAnalysis)}
                >
                  Analysis 1
                </Button>
                <Button
                  onClick={() => setShowSecondAnalysis(!showSecondAnalysis)}
                >
                  Analysis 2
                </Button>
              </div>
            </div>
            <div className="content--body__map">
              <Map returnRef={setMap} />
            </div>
            {(showFirstAnalysis || showSecondAnalysis) && (
              <div className="content--body__charts">
                {showFirstAnalysis && filteredData.length > 0 && (
                  <DieChart chartData={filteredData} />
                )}
                {showSecondAnalysis && filteredData.length > 0 && (
                  <BarChart chartData={filteredData} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
