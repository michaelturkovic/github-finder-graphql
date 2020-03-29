import axios from "axios";
import {
  Root,
  Arg,
  Query,
  Resolver,
  Mutation,
  Subscription,
  PubSub,
  Publisher
} from "type-graphql";
import User, { UserData } from "../models/User";
import { searchedUsers } from "../data";
import { NotificationData, Notification } from "../models/Notification";

const URL = "https://api.github.com/users";

@Resolver(of => User)
export class UserResolver {
  @Query(() => User, { description: "Fetch user by username" })
  // @Arg('username') username: String
  async user(@Arg("username") username: string): Promise<UserData> {
    let response = await axios.get(`${URL}/${username}`);
    let { data } = response;

    let foundUser = searchedUsers.find(user => user.id === data.id);

    if (foundUser) {
      foundUser.searchedForCounter += 1;
      return foundUser;
    } else {
      let user: UserData = {
        id: data.id,
        username: data.login,
        email: data.email,
        followers: data.followers,
        followed: data.following,
        searchedForCounter: 1
      };
      searchedUsers.push(user);
      return user;
    }
  }

  @Query(() => [User], { description: "Fetch most searched users by this api" })
  // @Arg('limit') limit: Int
  mostSearched(@Arg("limit") limit: number): UserData[] {
    return searchedUsers
      .slice(0, limit)
      .sort((a, b) => (a.searchedForCounter > b.searchedForCounter ? -1 : 1));
  }

  @Mutation(() => Boolean, { description: "Reset searched counter" })
  async deleteMostPopular(
    @PubSub("COUNTER") publish: Publisher<NotificationData>
  ) {
    if (searchedUsers.length > 0) {
      searchedUsers.map(user => (user.searchedForCounter = 0));
      await publish({ id: Date.now(), message: "Counter was reseted" });
      return true;
    } else {
      await publish({ id: Date.now(), message: "List is empty" });
      return false;
    }
  }

  @Subscription({
    topics: "COUNTER",
    description: "Subscription for delete most popular"
  })
  counterSubscription(@Root() { id, message }: NotificationData): Notification {
    return { id, message, date: new Date() };
  }
}
