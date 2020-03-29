import { Field, Int, ObjectType } from "type-graphql";

@ObjectType({ description: "The User model" })
export default class User {
  @Field(type => Int)
  id: number;

  @Field()
  username: string;

  @Field(type => String!, { nullable: true })
  email?: string;

  @Field(type => Int)
  followers: number;

  @Field(type => Int)
  followed: number;

  @Field(type => Int)
  searchedForCounter: number;
}

export interface UserData {
  id: number;
  username: string;
  email?: string;
  followers: number;
  followed: number;
  searchedForCounter: number;
}
