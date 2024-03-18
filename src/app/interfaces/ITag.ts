export interface ITag {
  _id?: string;
  title: string;
  slug: string;
}

export interface ITagDocs {
  data: ITag[];
  message: string;
}
