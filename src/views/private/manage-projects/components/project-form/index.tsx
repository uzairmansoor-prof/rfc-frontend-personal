import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Form from "@/components/form";
import SectionWrapper from "@/components/SectionWrapper"; // Import the new generic wrapper
import "./style.scss";
import { ProjectPayloadI } from "@/redux/projects/project-types";
import {
  useAddProjectMutation,
  useProductsQuery,
  useRegionsQuery,
  useUpdateProjectMutation,
} from "@/redux/projects/projecs-api";
import CustomButton from "@/components/customButton";
import { formatDateTime } from "@/core/utils/date-utils";
import { toast } from "react-toastify";
import { message, Upload, type UploadProps } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { UploadImageSvg } from "@/assets/img/icons";
import { UseNavigateStateParams } from "@/core/hooks/useNavigateServerParams";
import { MANAGE_SHEET } from "@/core/constants/route-constants";
import CustomCheckBox from "@/components/customCheckBox";
import { isEmpty } from "@/core/utils/functions";
interface Props {
  data: ProjectPayloadI;
  handleToggleDrawer: (event?: any) => void;
}
const ProjectForm = ({ data, handleToggleDrawer }: Props) => {
  const { data: productsData } = useProductsQuery(undefined);
  const { data: regionsData } = useRegionsQuery(undefined);

  const IS_EDIT = !!data?._id;

  const [addProject] = useAddProjectMutation();
  const [updateProject] = useUpdateProjectMutation();

  const formik = useFormik<ProjectPayloadI>({
    initialValues: data,
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Project Name is required"),
      clientName: Yup.string().required("Client Name is required"),
      description: Yup.string().required("Description is required"),
      owner: Yup.string().required("Owner is required"),
      dueDate: Yup.date().required("Due Date is required"), //Yup.array().of(Yup.date()).required("Due Date is required"),
      region: Yup.string().required("Region is required"),
      product: Yup.string().required("Product is required"),
      prompt: Yup.string().required("Prompt is required"),
      ...(!IS_EDIT && {
        file: Yup.mixed().required("RFP File is required"),
      }),
    }),

    onSubmit: (formValues) => {
      console.log({ formValues });

      const { file, ...payload } = { ...formValues };
      payload.dueDate = formatDateTime(payload.dueDate);

      (IS_EDIT ? updateProject : addProject)(payload)
        .unwrap()
        .then((res) => {
          console.log({ res });
          if (res?._id) {
            toast.success(
              IS_EDIT
                ? "Project Updated Successfully!"
                : "Project Created Successfully!",
            );
            if (!IS_EDIT) {
              handleNavigatePathState(MANAGE_SHEET, {
                file,
                project: res,
              });
            } else {
              handleToggleDrawer("update");
            }
          }
        });
    },
  });

  const { handleNavigatePathState } = UseNavigateStateParams();
  const props: UploadProps = {
    name: "file",
    showUploadList: true,
    multiple: false,
    fileList: !isEmpty(formik?.values?.file)
      ? ([formik?.values?.file] as any)
      : [],
    className: ` [&_.ant-upload]:!p-0 ${formik.errors?.file ? `[&_.ant-upload]:!border-error` : `[&_.ant-upload]:!border-primary`}`,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    beforeUpload(file) {
      // Return false to prevent automatic upload
      console.log({ file });

      const isWord =
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.endsWith(".docx");
      const isExcel =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.name.endsWith(".xlsx");

      if (!isWord && !isExcel) {
        message.error("You can only upload Word or Excel files!");
        return Upload.LIST_IGNORE; // Reject file upload
      }
      formik.setFieldValue("file", file);

      return false;
    },
    onRemove() {
      formik.setFieldValue("file", undefined);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <Form formikContext={formik} className="project-form-wrapper space-y-4">
      <SectionWrapper title="Project & Client Information">
        <div className="create-project-info grid grid-cols-2 gap-4">
          {/* <div className="flex-1"> */}
          <Form.Input
            labelText="Project Name"
            placeholder="Enter Project Name"
            name="name"
          />
          {/* </div>
          <div className="flex-1"> */}
          <Form.Input
            labelText="Client Name"
            placeholder="Enter Client Name"
            name="clientName"
          />
        </div>
        {/* </div>
        <div className="mt-4"> */}
        <Form.Input
          labelText="Description"
          placeholder="Enter Project Description"
          name="description"
          wrapperClass="!mb-[7px]"
        />
        {/* </div> */}
      </SectionWrapper>
      {/* Project Settings Section */}
      <SectionWrapper
        title="Project Settings"
        className=" grid grid-cols-2 gap-x-4"
      >
        <Form.Input
          labelText="Owner"
          placeholder="Enter Owner Name"
          name="owner"
        />
        <Form.DatePicker
          label="Due Date"
          placeholder="Select Due Date"
          name="dueDate"
        />
        <Form.Select
          label="Region"
          placeholder="Select Region"
          options={regionsData}
          name="region"
        />
        <Form.Select
          label="Product"
          placeholder="Select Product"
          options={productsData}
          name="product"
        />

        <Form.Input
          labelText="Prompt"
          placeholder="Enter Prompt"
          name="prompt"
          wrapperClass="  col-span-2"
        />
        <CustomCheckBox
          onChange={formik.handleChange}
          name="enableCollaborator"
          checked={formik.values.enableCollaborator}
          text=" Enable Open Collaborations"
          rootClassName="!mb-[7px]"
        />
      </SectionWrapper>
      {!IS_EDIT && (
        <>
          <Dragger {...props}>
            <div className="flex items-center  py-6 px-[2.2rem]">
              <UploadImageSvg />
              <div className=" [&_p]:mb-0 [&_p]:text-black ml-6 ">
                <p className=" text-sm  font-semibold">
                  {" "}
                  Select a file or drag and drop here{" "}
                </p>
                <p className=" text-[0.67rem]">
                  Word or Excel, file size no more than 10MB
                </p>
              </div>
            </div>
          </Dragger>
          {formik.errors?.file && (
            <div className={`text-xs !mt-1 text-error `}>
              {formik.errors?.file as string}
            </div>
          )}
        </>
      )}

      {/* Form Buttons Section */}
      <div className="flex justify-center gap-x-4">
        <CustomButton
          btnText={IS_EDIT ? "Update" : "Create"}
          btnType="primary"
          handleSubmit={formik.handleSubmit}
        />
        <CustomButton
          btnText="Cancel"
          btnType="tertiary"
          handleSubmit={handleToggleDrawer.bind({}, undefined)}
        />
      </div>
    </Form>
  );
};

export default ProjectForm;
