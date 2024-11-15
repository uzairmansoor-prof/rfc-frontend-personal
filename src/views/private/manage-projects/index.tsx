import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import dayjs from "dayjs";

import { isEmpty } from "@/core/utils/functions";
import AdminLayoutContentWrapper from "@/components/layouts/adminLayout/adminLayoutContentWrapper";
import ListingFilterSection from "@/components/listings/listingFilterSection";
import { UseNavigateStateParams } from "@/core/hooks/useNavigateServerParams";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import CustomButton from "@/components/customButton";
import SearchComponent from "@/components/listings/searchComponent";
import FormItemWrapper from "@/components/form/formItemWrapper";
import CustomSelect from "@/components/customSelect";
import CustomModal from "@/components/customModal";
import NewProjectForm from "./components/project-form";
import {
  useLazyProjectListingQuery,
  useOwnersQuery,
  useProductsQuery,
  useUpdateProjectStatusMutation,
} from "@/redux/projects/projecs-api";
import {
  ProjectPayloadI,
  ProjectRecordI,
  ProjectStatusEnum,
  ProjectStatusPayloadI,
  ProjectStatusText,
} from "@/redux/projects/project-types";
import ProjectTable from "./components/project-table";

const ManageProjects = () => {
  const [projectStatusOption] = useState([
    {
      name: ProjectStatusText[ProjectStatusEnum.Active],
      _id: ProjectStatusEnum.Active,
    },
    {
      name: ProjectStatusText[ProjectStatusEnum.InActive],
      _id: ProjectStatusEnum.InActive,
    },
  ]);
  const { data: ownersData } = useOwnersQuery(undefined);
  const { data: productsData } = useProductsQuery(undefined);
  const [updateProjectStatus] = useUpdateProjectStatusMutation();

  const initialValues: ProjectPayloadI = {
    _id: undefined,
    name: "",
    clientName: "",
    description: "",
    owner: undefined,
    dueDate: undefined,
    region: undefined,
    product: undefined,
    prompt: "",
    file: undefined,
  };

  const [modalData, setModalData] = useState(undefined);
  const [fetchUserList, { data }] = useLazyProjectListingQuery();

  console.log({ data });
  const location = useLocation();

  const defaultSort = useMemo(() => {
    if (location?.state?.orderColumn) {
      return location?.state;
    }
    return {
      orderColumn: "name",
      orderBy: "ascend",
    };
  }, [location?.state]);

  const { generateObjectByStateParams, handleNavigateStateParams, params } =
    UseNavigateStateParams();

  console.log({ params });
  useEffect(() => {
    const params = {
      ...generateObjectByStateParams(),
      orderColumn: defaultSort?.orderColumn,
      orderBy: defaultSort?.orderBy,
    };

    fetchUserList(params);
  }, [location?.state, defaultSort?.orderColumn]);

  const handleEditProject = (data: ProjectRecordI) => {
    const {
      product,
      region,
      updatedAt,
      createdAt,
      status,
      createdBy,
      ...restData
    } = data;
    handleToggleDrawer({
      ...restData,
      product: product?._id,
      region: region?._id,
      dueDate: dayjs(restData?.dueDate as string) as unknown as Date,
    } as ProjectPayloadI);
  };

  const setTextRef = useRef(null);

  const handleToggleDrawer = useCallback(
    (data = undefined) => {
      console.log({ dd: data });
      if (!isEmpty(data) && typeof data !== "string" && "_id" in data) {
        setModalData(data);
      } else {
        setModalData(undefined);

        if (data === "update" || data === "new") {
          // if (setTextRef.current?.setText) {
          //   setTextRef.current?.setText("");
          // }
          handleNavigateStateParams(
            data === "new" || !isEmpty(location.state?.searchText)
              ? { currentPage: 1, searchText: "" }
              : location.state,
          );
        }
      }
    },
    [setModalData, location?.state],
  );

  const handleToggleProjectStatus = (record: ProjectStatusPayloadI) => {
    updateProjectStatus(record)
      .unwrap()
      .then((value) => {
        if (!isEmpty(value)) {
          toast.success(
            !record?.status
              ? "Project Deactivated Successfully"
              : "Project Activated Successfully",
          );
        }
      });
  };

  const handleChangeDropdownFilter = (fieldName, value) => {
    handleNavigateStateParams({ [fieldName]: value, currentPage: 1 });
  };

  return (
    <div className="grid grid-cols-[270px_1fr]  h-full ">
      <ListingFilterSection
        btnProps={{
          btnText: "Create New Project",
          onClickHandler: handleToggleDrawer.bind({}, initialValues), // Open modal on button click
        }}
        title="Search Projects"
        searchProps={{
          searchKey: "users",
          setTextRef: setTextRef,
          serverSearching: true,
        }}
        topComponent={
          <>
            <FormItemWrapper
              labelText={"Project Name"}
              wrapperClass="!mb-0"
              showErrorText={true}
            >
              <SearchComponent
                search={"projectName"}
                setTextRef={setTextRef}
                serverSearching={true}
                searchTerm="Search Project"
              />
            </FormItemWrapper>
          </>
        }
        bottomComponent={
          <>
            <div className=" font-semibold">Filters</div>
            <FormItemWrapper
              labelText={"Owner Name"}
              wrapperClass="!mb-0"
              showErrorText={true}
            >
              <SearchComponent
                search={"owner"}
                setTextRef={setTextRef}
                serverSearching={true}
                searchTerm="Search Owner"
              />
            </FormItemWrapper>
            <CustomSelect
              wrapperClassName="mt-2"
              options={productsData}
              label={`Project Type`}
              fieldName="product"
              placeholder={"Select Type"}
              onChange={handleChangeDropdownFilter}
            />

            <CustomSelect
              wrapperClassName="mt-2"
              options={projectStatusOption}
              label={`Project Status`}
              fieldName="status"
              placeholder={"Select Type"}
              onChange={handleChangeDropdownFilter}
            />
          </>
        }
      />

      <AdminLayoutContentWrapper title={null}>
        <div className="flex justify-between items-center py-4 ">
          <span className=" text-base font-[500] text-xl">Recent Project</span>
          <CustomButton
            btnType="primary"
            icon={"Plus"}
            btnText={`Add New Project`}
            className={` !h-9}`}
            handleSubmit={handleToggleDrawer.bind({}, initialValues)}
          />
        </div>
        <ProjectTable
          data={data}
          // data={isLoading || isFetching ? undefined : users}
          handleEditProject={handleEditProject}
          defaultSort={defaultSort}
          // activeRowId={modalData?.id} // Passing the drawerData prop
          handleToggleProjectStatus={handleToggleProjectStatus}
        />
      </AdminLayoutContentWrapper>

      <CustomModal
        title={`${modalData?._id ? "Update" : "New"} Project`}
        visible={!isEmpty(modalData)}
        closeable={true}
        width={800}
        className="NewProjectModel"
        onClose={handleToggleDrawer.bind({}, undefined) as any}
      >
        <NewProjectForm
          data={modalData}
          handleToggleDrawer={handleToggleDrawer}
        />
      </CustomModal>
    </div>
  );
};

export default ManageProjects;
