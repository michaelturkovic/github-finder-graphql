import { ObjectType, Field, ID } from "type-graphql";

@ObjectType({ description: "The Notification model" })
export class Notification {
  @Field(type => ID)
  id: number;

  @Field({ nullable: true })
  message?: string;

  @Field(type => Date)
  date: Date;
}

export interface NotificationData {
  id: number;
  message?: string;
}