export interface createdByI {
  _id: string;
  email: string;
}
export interface ProductsI {
  _id: string;
  name: string;
}

export interface RegionsI {
  _id: string;
  name: string;
}

export interface OwnersI {
  _id: string;
  name: string;
  designationName: string;
}

export interface ProjectBaseI {
  _id?: string;
  name: string;
  clientName: string;
  description: string;
  prompt: string;
  dueDate?: Date | string;
  enableCollaborator?: boolean;
  owner: string;
}
export interface ProjectRecordI extends ProjectBaseI {
  createdBy: createdByI;
  status: ProjectStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
  region: RegionsI;
  product: ProductsI;
  reviewedCount: number;
  completedCount: number;
  totalQuestions: number;
}
export interface ProjectPayloadI extends ProjectBaseI {
  product: string;
  region: string;
  file?: File;
}

export type ProjectStatusPayloadI = Pick<ProjectRecordI, "_id" | "status">;

export enum ProjectStatusEnum {
  InActive = 0,
  Active,
}

export const ProjectStatusText = {
  [ProjectStatusEnum.Active]: "Active",
  [ProjectStatusEnum.InActive]: "In Active",
};

// export const dummyProjectsPaginated: PaginationResponseDTO<ProjectRecordI> = {
//   content: [
//     {
//       _id: "6710bb84f1431446f09faec2",
//       name: "Transcend US1",
//       clientName: "Netsol",
//       description: "This is a description of Transcend US.",
//       owner: {
//         _id: "670fbdc2403c7dca3da2b6ee",
//         name: "Muhammad Ahmed",
//         designationName: "Head of Sales",
//       },
//       region: {
//         _id: "670fb58ed93a5148553084a1",
//         name: "USA",
//       },
//       product: {
//         _id: "6710b263b42218da85b32905",
//         name: "Ascent 2.0",
//       },
//       prompt: "What are the deliverables for this project?",
//       completedQuestions: 50, // Percentage
//       reviewedQuestions: 50, // Percentage
//       dueDate: new Date(2024, 10, 5),
//       status: 1,
//       createdAt: new Date(2024, 8, 28),
//       createdBy: {
//         _id: "670cf0e70a37b773928a6b30",
//         email: "numanuet311@gmail.com",
//       },
//     },
//     {
//       _id: "6710bebc71c68f4d66040b46",
//       name: "Transcend UK",
//       clientName: "Netsol",
//       description: "This is a description of Transcend UK.",
//       owner: {
//         _id: "670fbdc2403c7dca3da2b6ee",
//         name: "Muhammad Ahmed",
//         designationName: "Head of Sales",
//       },
//       region: {
//         _id: "670fb58ed93a5148553084a1",
//         name: "UK",
//       },
//       product: {
//         _id: "6710b263b42218da85b32905",
//         name: "Ascent 2.0",
//       },
//       prompt: "What are the deliverables for this project?",
//       completedQuestions: 75, // Percentage
//       reviewedQuestions: 60, // Percentage
//       dueDate: new Date(2024, 10, 10),
//       status: 1,
//       createdAt: new Date(2024, 8, 28),
//       createdBy: {
//         _id: "670cf0e70a37b773928a6b30",
//         email: "numanuet311@gmail.com",
//       },
//     },
//   ],
//   totalRecords: 2, // Adjusted to match the number of records
// };
