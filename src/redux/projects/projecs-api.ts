import { PaginationResponseDTO } from "@/core/types/common";
import { apiSlice } from "..";
import {
  OwnersI,
  ProductsI,
  ProjectPayloadI,
  ProjectRecordI,
  ProjectStatusPayloadI,
  RegionsI,
} from "./project-types";
const baseUrl = `/projects`;

const projectApi = apiSlice
  .injectEndpoints({
    endpoints: (builder) => ({
      projectListing: builder.query<
        PaginationResponseDTO<ProjectRecordI>,
        Record<string, any>
      >({
        providesTags: [{ type: "Projects", id: "projects" }],
        query: (params) => ({
          url: `${baseUrl}`,
          method: "Get",
          params,
        }),
      }),
      owners: builder.query<OwnersI[], undefined | null>({
        providesTags: [{ type: "Projects", id: "owners" }],
        query: () => ({
          url: `/owners`,
          method: "Get",
        }),
      }),
      regions: builder.query<RegionsI[], undefined | null>({
        providesTags: [{ type: "Projects", id: "regions" }],
        query: () => ({
          url: `/regions`,
          method: "Get",
        }),
      }),
      products: builder.query<ProductsI[], undefined | null>({
        providesTags: [{ type: "Projects", id: "products" }],
        query: () => ({
          url: `/products`,
          method: "Get",
        }),
      }),
      addProject: builder.mutation<ProjectPayloadI, ProjectPayloadI>({
        query: (body) => ({
          url: `${baseUrl}`,
          method: "Post",
          body,
        }),
        invalidatesTags: (response) =>
          response?._id ? [{ type: "Projects", id: "project" }] : [],
      }),
      updateProject: builder.mutation<ProjectPayloadI, ProjectPayloadI>({
        query: (body) => ({
          url: `${baseUrl}/${body._id}`,
          method: "Put",
          body,
        }),
        invalidatesTags: (response) =>
          response?._id ? [{ type: "Projects", id: "projects" }] : [],
      }),
      updateProjectStatus: builder.mutation<
        ProjectPayloadI,
        ProjectStatusPayloadI
      >({
        query: (body) => ({
          url: `${baseUrl}/status/updateStatus`,
          method: "Put",
          body,
        }),
        invalidatesTags: (response) =>
          response?._id ? [{ type: "Projects", id: "projects" }] : [],
      }),
    }),
  })

  .enhanceEndpoints({
    addTagTypes: ["Projects"],
  });

export const {
  useProjectListingQuery,
  useLazyProjectListingQuery,
  useOwnersQuery,
  useProductsQuery,
  useRegionsQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useUpdateProjectStatusMutation,
  //   useUserCountQuery,
  //   useLazyUserCountQuery,
  //   useAddUserMutation,
  //   useUpdateUserMutation,
  //   useCitiesByCountryIdQuery,
  //   useRegionsByCityIdQuery,
  //   useLazyCitiesByCountryIdQuery,
  //   useLazyRegionsByCityIdQuery,
  //   useRoleListQuery,
  //   useCountriesQuery,
  //   useGetUserImageQuery,
  //   useLazyGetUserImageQuery,
  //   useUserActivateMutation,
  //   useUserDeactivateMutation,
  //   useSelectLanguageMutation,
} = projectApi;
