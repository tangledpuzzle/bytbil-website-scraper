import { NextRequest, NextResponse } from "next/server";
import { ddbDocClient } from "@/database/dynamodbClient";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { createNotifications } from "@/utils/createandUpdateNotifications";
import { v4 as uuidv4 } from "uuid";
import getLatLngFromZip from "@/utils/getLatLngFromZip";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const {Venue,userEmail,EntityListNameId,EntityListUserName} = data;
  // console.log("data ", data);
  const {
    type,
    name,
    spaceName,
    eventEntityType,
    address,
    city,
    state,
    country,
    zipCode,
    rating,
    phoneNumber,
    phoneNumberTwo,
    email,
    standing,
    squareFeet,
    seated,
    images,
    status,
    rentalFee,
    permitRequired,
    websiteUrl,
    category,
  } = Venue;


  if (!name || !EntityListNameId || !userEmail || !zipCode || !type) {
    return NextResponse.json(
      {
        status: 400,
        message: "Venue name is required",
      },
      {
        status: 400,
      }
    );
  }

  const sharedVenueVendorId = generateId();

  const result = (await getLatLngFromZip(zipCode)) || { lat: 0, lng: 0 };

  const sharedVenue = {
    sharedVenueVendorId,
    type,
    name,
    EntityListNameId,
    spaceName,
    eventEntityType,
    address,
    city,
    state,
    country,
    zipCode,
    rating,
    phoneNumber,
    phoneNumberTwo,
    email,
    standing,
    squareFeet,
    seated,
    lat: result.lat,
    lng: result.lng,
    images,
    status,
    rentalFee,
    permitRequired,
    websiteUrl,
    category,
    sharedDate: Date.now(),
    sendBy: "admin",
    userEmail,
    EntityListUserName
  };

  // console.log("sharedVenues ", sharedVenue);

  const response = await ddbDocClient.send(
    new PutCommand({
      TableName: "SharedVenueVendor",
      Item: sharedVenue,
    })
  );

  if (response.$metadata.httpStatusCode !== 200) {
    return NextResponse.json(
      {
        message: "Not able to share venue ",
        status: 400,
      },
      {
        status: 400,
      }
    );
  }

  // console.log("response ", response);

  const createNotificationsResponse = await createNotifications(userEmail);

  if (createNotificationsResponse.$metadata.httpStatusCode !== 200) {
    return NextResponse.json(
      {
        message: "Not able to share venue ",
        status: 400,
      },
      {
        status: 400,
      }
    );
  }

  return NextResponse.json({
    status: 200,
    message: "Venue shared successfully",
    data: sharedVenue,
  });
}

const generateId = () => {
  return uuidv4().split("-").join("") + Date.now();
};

export async function GET(request: NextRequest) {
  const { userEmail } = await request.json();
  const response = await ddbDocClient.send(
    new GetCommand({
      TableName: "SharedVenueVendor",
      Key: {
        userEmail,
      },
    })
  );

  if (response.$metadata.httpStatusCode !== 200) {
    return NextResponse.json(
      {
        message: "Not able to get shared venues ",
        status: 400,
      },
      {
        status: 400,
      }
    );
  }

  return NextResponse.json({
    status: 200,
    message: "Shared venues fetched successfully",
    data: response.Item,
  });
}
