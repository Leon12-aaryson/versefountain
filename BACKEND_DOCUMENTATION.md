# Backend Documentation

## Table of Contents
* [1. Database Schema](#1-database-schema)
  * [1.1. `users` Table](#11-users-table)
  * [1.2. `poetFollowers` Table](#12-poetfollowers-table)
  * [1.3. `poems` Table](#13-poems-table)
  * [1.4. `books` Table](#14-books-table)
  * [1.5. `events` Table](#15-events-table)
  * [1.6. `chatRooms` Table](#16-chatrooms-table)
  * [1.7. `chatMessages` Table](#17-chatmessages-table)
  * [1.8. `academicResources` Table](#18-academicresources-table)
  * [1.9. `payments` Table](#19-payments-table)
  * [1.10. `tickets` Table](#110-tickets-table)
  * [1.11. `userPoems` Table](#111-userpoems-table)
  * [1.12. `userChatRooms` Table](#112-userchatrooms-table)
  * [1.13. `poemComments` Table](#113-poemcomments-table)
  * [1.14. `commentReactions` Table](#114-commentreactions-table)
* [2. Data Models and Validation](#2-data-models-and-validation)
  * [2.1. User Model](#21-user-model)
  * [2.2. PoetFollower Model](#22-poetfollower-model)
  * [2.3. Poem Model](#23-poem-model)
  * [2.4. Book Model](#24-book-model)
  * [2.5. Event Model](#25-event-model)
  * [2.6. ChatRoom Model](#26-chatroom-model)
  * [2.7. ChatMessage Model](#27-chatmessage-model)
  * [2.8. AcademicResource Model](#28-academicresource-model)
  * [2.9. Payment Model](#29-payment-model)
  * [2.10. Ticket Model](#210-ticket-model)
  * [2.11. UserPoem Model](#211-userpoem-model)
  * [2.12. UserChatRoom Model](#212-userchatroom-model)
  * [2.13. PoemComment Model](#213-poemcomment-model)
  * [2.14. CommentReaction Model](#214-commentreaction-model)
* [3. API Endpoints](#3-api-endpoints)
  * [3.1. Resource: Auth](#31-resource-auth)
  * [3.2. Resource: Poems](#32-resource-poems)
    * [GET /api/poems](#get-apipoems)
    * [GET /api/poems/user](#get-apipoemsuser)
    * [GET /api/poems/:id](#get-apipoemsid)
    * [POST /api/poems](#post-apipoems)
    * [PATCH /api/poems/:id](#patch-apipoemsid)
    * [DELETE /api/poems/:id](#delete-apipoemsid)
    * [POST /api/poems/:id/approve](#post-apipoemsidapprove)
    * [POST /api/poems/:id/rate](#post-apipoemsidrate)
    * [POST /api/poems/:id/like](#post-apipoemsidlike)
    * [POST /api/poems/:id/unlike](#post-apipoemsidunlike)
    * [GET /api/poems/:id/likes](#get-apipoemsidlike-count)
    * [GET /api/poems/:id/user-status](#get-apipoemsiduser-status)
  * [3.3. Resource: Poem Comments](#33-resource-poem-comments)
    * [GET /api/poems/:id/comments](#get-apipoemsidcomments)
    * [POST /api/poems/:id/comments](#post-apipoemsidcomments)
    * [DELETE /api/poems/comments/:id](#delete-apipoemscommentsid)
  * [3.4. Resource: Comment Reactions](#34-resource-comment-reactions)
    * [GET /api/comments/:id/reactions](#get-apicommentsidreactions)
    * [GET /api/comments/:id/reaction-counts](#get-apicommentsidreaction-counts)
    * [GET /api/comments/reactions](#get-apicommentsreactions)
    * [GET /api/comments/:id/user-reaction](#get-apicommentsiduser-reaction)
    * [POST /api/comments/:id/reactions](#post-apicommentsidreactions)
    * [DELETE /api/comments/:id/reactions](#delete-apicommentsidreactions)
  * [3.5. Resource: Books](#35-resource-books)
    * [GET /api/books](#get-apibooks)
    * [GET /api/books/:id](#get-apibooksid)
    * [POST /api/upload/bookcover](#post-apiuploadbookcover)
    * [POST /api/books](#post-apibooks)
  * [3.6. Resource: Events](#36-resource-events)
    * [GET /api/events](#get-apievents)
    * [GET /api/events/poetry](#get-apieventspoetry)
    * [GET /api/events/:id](#get-apieventsid)
    * [POST /api/events](#post-apievents)
    * [PUT /api/events/:id](#put-apieventsid)
  * [3.7. Resource: Chat Rooms & Messages](#37-resource-chat-rooms--messages)
    * [GET /api/chat/rooms](#get-apichatrooms)
    * [GET /api/chat/rooms/:id](#get-apichatroomsid)
    * [POST /api/chat/rooms](#post-apichatrooms)
    * [GET /api/chat/rooms/:id/messages](#get-apichatroomsidmessages)
    * [POST /api/chat/rooms/:id/messages](#post-apichatroomsidmessages)
    * [GET /api/user/chat/rooms](#get-apiuserchatrooms)
    * [POST /api/chat/rooms/:id/join](#post-apichatroomsidjoin)
    * [POST /api/chat/rooms/:id/leave](#post-apichatroomsidleave)
    * [GET /api/chat/rooms/:id/membership](#get-apichatroomsidmembership)
  * [3.8. Resource: Academic Resources](#38-resource-academic-resources)
    * [GET /api/academic-resources](#get-apiacademic-resources)
    * [GET /api/academic-resources/:id](#get-apiacademic-resourcesid)
    * [POST /api/academic-resources](#post-apiacademic-resources)
  * [3.9. Resource: Poets (Users) & Following](#39-resource-poets-users--following)
    * [GET /api/poets/featured](#get-apipoetsfeatured)
    * [POST /api/poets/:id/follow](#post-apipoetsidfollow)
    * [POST /api/poets/:id/unfollow](#post-apipoetsidunfollow)
    * [GET /api/poets/:id/followers](#get-apipoetsidfollowers)
    * [GET /api/user/followed-poets](#get-apiuserfollowed-poets)
    * [GET /api/poets/:id/following-status](#get-apipoetsidfollowing-status)
  * [3.10. Resource: Tickets & Payments](#310-resource-tickets--payments)
    * [POST /api/tickets/purchase (Deprecated or General Purpose)](#post-apiticketspurchase-deprecated-or-general-purpose)
    * [POST /api/tickets (Primarily for Free Event Registration)](#post-apitickets-primarily-for-free-event-registration)
    * [GET /api/tickets](#get-apitickets)
    * [GET /api/tickets/user](#get-apiticketsuser)
    * [GET /api/tickets/:id](#get-apiticketsid)
    * [POST /api/payments](#post-apipayments)
    * [PATCH /api/payments/:id/status](#patch-apipaymentsidstatus)
    * [PATCH /api/payments/:id/refund](#patch-apipaymentsidrefund)
    * [PATCH /api/tickets/:id/status](#patch-apiticketsidstatus)
    * [POST /api/tickets/:id/cancel](#post-apiticketsidcancel)
  * [3.11. Resource: Admin](#311-resource-admin)
    * [GET /api/admin/users](#get-apiadminusers)
    * [PATCH /api/admin/users/:id](#patch-apiadminusersid)
    * [DELETE /api/admin/users/:id](#delete-apiadminusersid)
    * [GET /api/admin/pending/books](#get-apiadminpendingbooks)
    * [GET /api/admin/pending/poems](#get-apiadminpendingpoems)
    * [PATCH /api/admin/books/:id/approve](#patch-apiadminbooksidapprove)
    * [DELETE /api/admin/books/:id](#delete-apiadminbooksid)
    * [DELETE /api/admin/poems/:id](#delete-apiadminpoemsid)
    * [GET /api/admin/tickets/event/:event_id](#get-apiadminticketseventevent_id)
  * [3.12. Resource: Paddle Webhook (Payments)](#312-resource-paddle-webhook-payments)
    * [POST /api/paddle/webhook](#post-apipaddlewebhook)
  * [3.13. Static File Serving](#313-static-file-serving)
    * [GET /uploads/*](#get-uploads)
* [4. Authentication and Authorization](#4-authentication-and-authorization)
  * [4.1. Authentication Overview](#41-authentication-overview)
  * [4.2. Password Management](#42-password-management)
  * [4.3. Session Management](#43-session-management)
  * [4.4. Key Authentication Endpoints](#44-key-authentication-endpoints)
  * [4.5. Authorization](#45-authorization)
* [5. Real-Time Chat Service (WebSockets)](#5-real-time-chat-service-websockets)
  * [5.1. Overview](#51-overview)
  * [5.2. Connection Handling](#52-connection-handling)
  * [5.3. Authentication](#53-authentication)
  * [5.4. Joining Chat Rooms](#54-joining-chat-rooms)
  * [5.5. Sending and Receiving Chat Messages](#55-sending-and-receiving-chat-messages)
  * [5.6. Other Message Types](#56-other-message-types)
  * [5.7. Error Handling](#57-error-handling)
  * [5.8. Key Server-Side Data Structures](#58-key-server-side-data-structures)
* [6. Backend Architecture Overview](#6-backend-architecture-overview)
  * [6.1. Core Technologies](#61-core-technologies)
  * [6.2. Project Structure](#62-project-structure)
  * [6.3. Database](#63-database)
  * [6.4. Key Components and Flow](#64-key-components-and-flow)
  * [6.5. Simplified HTTP Request Lifecycle](#65-simplified-http-request-lifecycle)
  * [6.6. Database Seeding (`server/seed.ts`)](#66-database-seeding-serverseedts)
* [7. Deployment (Netlify)](#7-deployment-netlify)
  * [7.1. API as Serverless Function](#71-api-as-serverless-function)
  * [7.2. WebSocket Handling on Netlify](#72-websocket-handling-on-netlify)
  * [7.3. `netlify.toml` (Configuration File)](#73-netlifytoml-configuration-file)
  * [7.4. Frontend Deployment](#74-frontend-deployment)

## 1. Database Schema

### 1.1. `users` Table

*   **Purpose:** Stores information about registered users.
*   **Columns:**
    *   `id`: `serial` - Primary Key, Auto-incrementing ID for the user.
    *   `username`: `text` - Not Null, Unique. The user's chosen username.
    *   `password`: `text` - Not Null. The user's hashed password.
    *   `email`: `text` - Not Null. The user's email address.
    *   `isAdmin`: `boolean` - Default: `false`. Flag indicating if the user has administrative privileges.
*   **Relationships:**
    *   Referenced by `poetFollowers.follower_id`, `poetFollowers.poet_id`, `poems.author_id`, `books.uploadedById`, `events.created_by_id`, `chatRooms.created_by_id`, `chatMessages.user_id`, `payments.user_id`, `tickets.user_id`, `userPoems.user_id`, `userChatRooms.user_id`, `poemComments.user_id`, `commentReactions.user_id`.

### 1.2. `poetFollowers` Table

*   **Purpose:** Tracks users who follow other users (poets).
*   **Columns:**
    *   `id`: `serial` - Primary Key, Auto-incrementing ID for the follow relationship.
    *   `follower_id`: `integer` - Not Null. Foreign Key referencing `users.id`. The ID of the user who is following.
    *   `poet_id`: `integer` - Not Null. Foreign Key referencing `users.id`. The ID of the user (poet) being followed.
    *   `createdAt`: `timestamp` - Default: `now()`. Timestamp of when the follow relationship was created.
*   **Constraints:**
    *   `UNIQUE` on (`follower_id`, `poet_id`) - Ensures a user cannot follow the same poet multiple times.
*   **Relationships:**
    *   `follower_id` references `users.id`.
    *   `poet_id` references `users.id`.

### 1.3. `poems` Table

*   **Purpose:** Stores poems created by users.
*   **Columns:**
    *   `id`: `serial` - Primary Key, Auto-incrementing ID for the poem.
    *   `title`: `text` - Not Null. The title of the poem.
    *   `content`: `text` - Not Null. The content of the poem.
    *   `author_id`: `integer` - Not Null. Foreign Key referencing `users.id`. The ID of the user who authored the poem.
    *   `createdAt`: `timestamp` - Default: `now()`. Timestamp of when the poem was created.
    *   `isVideo`: `boolean` - Default: `false`. Flag indicating if the poem is a video.
    *   `videoUrl`: `text` - Nullable. The URL of the video if `isVideo` is true.
    *   `approved`: `boolean` - Default: `true`. Flag indicating if the poem is approved. (Note: `schema.ts` says `default(true)`, migration `0000_fine_wither.sql` says `DEFAULT false`, migration `0001_fast_lockheed.sql` sets `DEFAULT true`. The latest schema definition in `schema.ts` and the later migration `0001_fast_lockheed.sql` both indicate `true` as the intended default).
*   **Relationships:**
    *   `author_id` references `users.id`.
    *   Referenced by `userPoems.poem_id`, `poemComments.poem_id`.

### 1.4. `books` Table

*   **Purpose:** Stores information about books uploaded by users.
*   **Columns:**
    *   `id`: `serial` - Primary Key, Auto-incrementing ID for the book.
    *   `title`: `text` - Not Null. The title of the book.
    *   `author`: `text` - Not Null. The author of the book.
    *   `description`: `text` - Nullable. A description of the book.
    *   `coverImage`: `text` - Nullable. URL of the book's cover image.
    *   `uploadedById`: `integer` - Nullable. Foreign Key referencing `users.id`. The ID of the user who uploaded the book.
    *   `genre`: `text` - Nullable. The genre of the book.
    *   `approved`: `boolean` - Default: `true`. Flag indicating if the book is approved. (Note: `schema.ts` says `default(true)`, migration `0000_fine_wither.sql` says `DEFAULT false`, migration `0001_fast_lockheed.sql` sets `DEFAULT true`. The latest schema definition in `schema.ts` and the later migration `0001_fast_lockheed.sql` both indicate `true` as the intended default).
*   **Relationships:**
    *   `uploadedById` references `users.id`.

### 1.5. `events` Table

*   **Purpose:** Stores information about events.
*   **Columns:**
    *   `id`: `serial` - Primary Key, Auto-incrementing ID for the event.
    *   `title`: `text` - Not Null. The title of the event.
    *   `description`: `text` - Nullable. A description of the event.
    *   `date`: `timestamp` - Not Null. The date and time of the event.
    *   `location`: `text` - Not Null. The location of the event.
    *   `ticketPrice`: `integer` - Default: `0`. The price of a ticket for the event.
    *   `organizer`: `text` - Nullable. The organizer of the event.
    *   `isVirtual`: `boolean` - Default: `false`. Flag indicating if the event is virtual.
    *   `streamUrl`: `text` - Nullable. The URL for the event stream if `isVirtual` is true.
    *   `isFree`: `boolean` - Default: `false`. Flag indicating if the event is free. (Note: `schema.ts` has `default(false)`, migration `0000_fine_wither.sql` does not specify a default, so `false` as per `schema.ts` is likely correct. `insertEventSchema` also defaults `isFree` to `true` at application level if not provided, which might override DB default in practice for new inserts).
    *   `created_by_id`: `integer` - Nullable. Foreign Key referencing `users.id`. The ID of the user who created the event. (Added in `0001_fast_lockheed.sql` migration and `schema.ts`)
    *   `category`: `text` - Default: `general`. The category of the event (e.g., "poetry", "book_launch", "workshop", "lecture", "general"). (Added in `0001_fast_lockheed.sql` migration and `schema.ts`)
*   **Relationships:**
    *   `created_by_id` references `users.id`.
    *   Referenced by `payments.event_id`, `tickets.event_id`.

### 1.6. `chatRooms` Table

*   **Purpose:** Stores information about chat rooms created by users.
*   **Columns:**
    *   `id`: `serial` - Primary Key, Auto-incrementing ID for the chat room.
    *   `name`: `text` - Not Null. The name of the chat room.
    *   `description`: `text` - Nullable. A description of the chat room.
    *   `created_by_id`: `integer` - Nullable. Foreign Key referencing `users.id`. The ID of the user who created the chat room.
    *   `isPrivate`: `boolean` - Default: `false`. Flag indicating if the chat room is private.
*   **Relationships:**
    *   `created_by_id` references `users.id`.
    *   Referenced by `chatMessages.room_id`, `userChatRooms.room_id`.

### 1.7. `chatMessages` Table

*   **Purpose:** Stores individual messages sent within chat rooms.
*   **Columns:**
    *   `id`: `serial` - Primary Key, Auto-incrementing ID for the message.
    *   `room_id`: `integer` - Not Null. Foreign Key referencing `chatRooms.id`. The ID of the chat room where the message was sent.
    *   `user_id`: `integer` - Not Null. Foreign Key referencing `users.id`. The ID of the user who sent the message.
    *   `message`: `text` - Not Null. The content of the message.
    *   `createdAt`: `timestamp` - Default: `now()`. Timestamp of when the message was sent.
*   **Relationships:**
    *   `room_id` references `chatRooms.id`.
    *   `user_id` references `users.id`.

### 1.8. `academicResources` Table

*   **Purpose:** Stores information about academic resources.
*   **Columns:**
    *   `id`: `serial` - Primary Key, Auto-incrementing ID for the academic resource.
    *   `title`: `text` - Not Null. The title of the academic resource.
    *   `description`: `text` - Nullable. A description of the academic resource.
    *   `type`: `text` - Not Null. The type of the academic resource (e.g., "study_guide", "video", "career_guide").
    *   `subject`: `text` - Nullable. The subject of the academic resource.
    *   `gradeLevel`: `text` - Nullable. The grade level for which the academic resource is intended.
    *   `language`: `text` - Default: `English`. The language of the academic resource.
    *   `resourceUrl`: `text` - Nullable. The URL of the academic resource.
*   **Relationships:**
    *   None explicitly defined in the provided schema for this table.

### 1.9. `payments` Table

*   **Purpose:** Stores information about payments made by users for events.
*   **Columns:**
    *   `id`: `serial` - Primary Key, Auto-incrementing ID for the payment.
    *   `user_id`: `integer` - Not Null. Foreign Key referencing `users.id`. The ID of the user who made the payment.
    *   `event_id`: `integer` - Not Null. Foreign Key referencing `events.id`. The ID of the event for which the payment was made.
    *   `amount`: `integer` - Not Null. The amount of the payment.
    *   `currency`: `text` - Default: `USD`. The currency of the payment.
    *   `status`: `text` - Not Null. The status of the payment (e.g., "pending", "completed", "refunded", "failed").
    *   `paddlepayment_id`: `text` - Nullable. The ID of the payment from the Paddle payment provider.
    *   `paddleTransactionId`: `text` - Nullable. The ID of the transaction from the Paddle payment provider.
    *   `createdAt`: `timestamp` - Default: `now()`. Timestamp of when the payment was created.
    *   `updatedAt`: `timestamp` - Default: `now()`. Timestamp of when the payment was last updated.
    *   `refundReason`: `text` - Nullable. The reason for a refund, if applicable.
*   **Relationships:**
    *   `user_id` references `users.id`.
    *   `event_id` references `events.id`.
    *   Referenced by `tickets.payment_id`.

### 1.10. `tickets` Table

*   **Purpose:** Stores information about tickets purchased by users for events.
*   **Columns:**
    *   `id`: `serial` - Primary Key, Auto-incrementing ID for the ticket.
    *   `event_id`: `integer` - Not Null. Foreign Key referencing `events.id`. The ID of the event for which the ticket was purchased.
    *   `user_id`: `integer` - Not Null. Foreign Key referencing `users.id`. The ID of the user who purchased the ticket.
    *   `purchaseDate`: `timestamp` - Default: `now()`. Timestamp of when the ticket was purchased.
    *   `ticketCode`: `text` - Not Null, Unique. The unique code for the ticket.
    *   `status`: `text` - Default: `active`, Not Null. The status of the ticket (e.g., "active", "cancelled", "used"). (Added in `0001_fast_lockheed.sql` migration and `schema.ts`)
    *   `payment_id`: `integer` - Nullable. Foreign Key referencing `payments.id`. The ID of the payment associated with this ticket. (Added in `0001_fast_lockheed.sql` migration and `schema.ts`)
    *   `isRefunded`: `boolean` - Default: `false`. Flag indicating if the ticket has been refunded. (Added in `0001_fast_lockheed.sql` migration and `schema.ts`)
*   **Constraints:**
    *   `UNIQUE` on (`ticketCode`) - Ensures ticket codes are unique.
*   **Relationships:**
    *   `event_id` references `events.id`.
    *   `user_id` references `users.id`.
    *   `payment_id` references `payments.id`.

### 1.11. `userPoems` Table

*   **Purpose:** Tracks user interactions with poems, such as ratings and likes.
*   **Columns:**
    *   `id`: `serial` - Primary Key, Auto-incrementing ID for the user-poem interaction. (Added in `0002_true_ravenous.sql` migration and `schema.ts`, previously composite PK on `user_id`, `poem_id`)
    *   `user_id`: `integer` - Not Null. Foreign Key referencing `users.id`. The ID of the user.
    *   `poem_id`: `integer` - Not Null. Foreign Key referencing `poems.id`. The ID of the poem.
    *   `rating`: `integer` - Nullable. The rating given by the user to the poem.
    *   `liked`: `boolean` - Default: `false`. Flag indicating if the user liked the poem.
*   **Constraints:**
    *   `UNIQUE` on (`user_id`, `poem_id`) - Ensures a user can only have one interaction entry per poem. (Index added in `0002_true_ravenous.sql` migration and `schema.ts`)
*   **Relationships:**
    *   `user_id` references `users.id`.
    *   `poem_id` references `poems.id`.

### 1.12. `userChatRooms` Table

*   **Purpose:** Tracks users who have joined specific chat rooms.
*   **Columns:**
    *   `id`: `serial` - Primary Key, Auto-incrementing ID for the user-chat room link.
    *   `user_id`: `integer` - Not Null. Foreign Key referencing `users.id`. The ID of the user.
    *   `room_id`: `integer` - Not Null. Foreign Key referencing `chatRooms.id`. The ID of the chat room.
    *   `joinedAt`: `timestamp` - Default: `now()`. Timestamp of when the user joined the chat room.
*   **Relationships:**
    *   `user_id` references `users.id`.
    *   `room_id` references `chatRooms.id`.

### 1.13. `poemComments` Table

*   **Purpose:** Stores comments made by users on poems.
*   **Columns:**
    *   `id`: `serial` - Primary Key, Auto-incrementing ID for the comment.
    *   `poem_id`: `integer` - Not Null. Foreign Key referencing `poems.id`. The ID of the poem that was commented on.
    *   `user_id`: `integer` - Not Null. Foreign Key referencing `users.id`. The ID of the user who made the comment.
    *   `content`: `text` - Not Null. The content of the comment.
    *   `createdAt`: `timestamp` - Default: `now()`. Timestamp of when the comment was created.
*   **Relationships:**
    *   `poem_id` references `poems.id`.
    *   `user_id` references `users.id`.
    *   Referenced by `commentReactions.comment_id`.

### 1.14. `commentReactions` Table

*   **Purpose:** Stores reactions made by users to comments on poems.
*   **Columns:**
    *   `id`: `serial` - Primary Key, Auto-incrementing ID for the reaction.
    *   `comment_id`: `integer` - Not Null. Foreign Key referencing `poemComments.id`. The ID of the comment that was reacted to.
    *   `user_id`: `integer` - Not Null. Foreign Key referencing `users.id`. The ID of the user who made the reaction.
    *   `reaction`: `text` - Not Null. The type of reaction (e.g., "like", "love", "laugh", "angry").
    *   `createdAt`: `timestamp` - Default: `now()`. Timestamp of when the reaction was created.
*   **Relationships:**
    *   `comment_id` references `poemComments.id`.
    *   `user_id` references `users.id`.

## 2. Data Models and Validation

### 2.1. User Model

*   **Model Name:** `User`
*   **Associated Table:** `users`
*   **Attributes:**
    *   `id`: `number` (from `serial`)
    *   `username`: `string` (from `text`)
    *   `password`: `string` (from `text`) - Note: This is the hashed password.
    *   `email`: `string` (from `text`)
    *   `isAdmin`: `boolean` (from `boolean`)
*   **Validation Schemas:**
    *   **`insertUserSchema`**: Used for validating new user registration data. Derived from `users` table schema using `createInsertSchema`.
        *   Picks: `username`, `password`, `email`, `isAdmin`.
        *   `username`: `string` - Required.
        *   `password`: `string` - Required.
        *   `email`: `string` - Required. (Implicitly, should be a valid email format, though not explicitly stated in Zod schema, but the `email` column type in the database implies this expectation).
        *   `isAdmin`: `boolean` - Optional.
        *   Extended with:
            *   `confirmPassword`: `string` - Required. Used to ensure password confirmation matches.
    *   **`loginUserSchema`**: Used for validating user login credentials. Custom Zod object.
        *   `username`: `string` - Required, minimum 3 characters.
        *   `password`: `string` - Required, minimum 6 characters.
*   **TypeScript Types:**
    *   `User = typeof users.$inferSelect;` (Select model for fetching user data)
    *   `InsertUser = z.infer<typeof insertUserSchema>;` (Type for data to insert a new user)
    *   `LoginUser = z.infer<typeof loginUserSchema>;` (Type for login credentials)

### 2.2. PoetFollower Model

*   **Model Name:** `PoetFollower`
*   **Associated Table:** `poet_followers`
*   **Attributes:**
    *   `id`: `number` (from `serial`)
    *   `follower_id`: `number` (from `integer`)
    *   `poet_id`: `number` (from `integer`)
    *   `createdAt`: `Date` (from `timestamp`)
*   **Validation Schemas:**
    *   **`insertPoetFollowerSchema`**: Used for validating data when a user follows a poet. Derived from `poetFollowers` table schema using `createInsertSchema`.
        *   Omits: `id`, `createdAt`. (These are auto-generated or defaulted by the database).
        *   `follower_id`: `number` - Required. (Implicitly, from the table schema).
        *   `poet_id`: `number` - Required. (Implicitly, from the table schema).
*   **TypeScript Types:**
    *   `PoetFollower = typeof poetFollowers.$inferSelect;` (Select model for fetching poet follower data)
    *   `InsertPoetFollower = z.infer<typeof insertPoetFollowerSchema>;` (Type for data to create a new poet follower relationship)

### 2.3. Poem Model

*   **Model Name:** `Poem`
*   **Associated Table:** `poems`
*   **Attributes:**
    *   `id`: `number` (from `serial`)
    *   `title`: `string` (from `text`)
    *   `content`: `string` (from `text`)
    *   `author_id`: `number` (from `integer`)
    *   `createdAt`: `Date` (from `timestamp`)
    *   `isVideo`: `boolean` (from `boolean`)
    *   `videoUrl`: `string | null` (from `text`, can be null if `isVideo` is `false`)
    *   `approved`: `boolean` (from `boolean`)
*   **Validation Schemas:**
    *   **`insertPoemSchema`**: Used for validating data when a new poem is created. Derived from `poems` table schema using `createInsertSchema`.
        *   Omits: `id`, `author_id`, `createdAt`, `approved`. (These are auto-generated, context-dependent, or defaulted).
        *   `title`: `string` - Required.
        *   `content`: `string` - Required.
        *   `isVideo`: `boolean` - Optional, defaults to `false`.
        *   `videoUrl`: `string` - Optional.
*   **TypeScript Types:**
    *   `Poem = typeof poems.$inferSelect;` (Select model for fetching poem data)
    *   `InsertPoem = z.infer<typeof insertPoemSchema>;` (Type for data to insert a new poem)

### 2.4. Book Model

*   **Model Name:** `Book`
*   **Associated Table:** `books`
*   **Attributes:**
    *   `id`: `number` (from `serial`)
    *   `title`: `string` (from `text`)
    *   `author`: `string` (from `text`)
    *   `description`: `string | null` (from `text`)
    *   `coverImage`: `string | null` (from `text`)
    *   `uploadedById`: `number | null` (from `integer`)
    *   `genre`: `string | null` (from `text`)
    *   `approved`: `boolean` (from `boolean`)
*   **Validation Schemas:**
    *   **`insertBookSchema`**: Used for validating data when a new book is added. Derived from `books` table schema using `createInsertSchema`.
        *   Omits: `id`, `uploadedById`, `approved`. (These are auto-generated, context-dependent, or defaulted).
        *   `title`: `string` - Required.
        *   `author`: `string` - Required.
        *   `description`: `string` - Optional.
        *   `coverImage`: `string` - Optional.
        *   `genre`: `string` - Optional.
*   **TypeScript Types:**
    *   `Book = typeof books.$inferSelect;` (Select model for fetching book data)
    *   `InsertBook = z.infer<typeof insertBookSchema>;` (Type for data to insert a new book)

### 2.5. Event Model

*   **Model Name:** `Event`
*   **Associated Table:** `events`
*   **Attributes:**
    *   `id`: `number` (from `serial`)
    *   `title`: `string` (from `text`)
    *   `description`: `string | null` (from `text`)
    *   `date`: `Date` (from `timestamp`)
    *   `location`: `string` (from `text`)
    *   `ticketPrice`: `number` (from `integer`)
    *   `organizer`: `string | null` (from `text`)
    *   `isVirtual`: `boolean` (from `boolean`)
    *   `streamUrl`: `string | null` (from `text`)
    *   `isFree`: `boolean` (from `boolean`)
    *   `created_by_id`: `number | null` (from `integer`)
    *   `category`: `string` (from `text`) - Can be 'poetry', 'book_launch', 'workshop', 'lecture', or 'general'.
*   **Validation Schemas:**
    *   **`insertEventSchema`**: Used for validating data when a new event is created. Derived from `events` table schema using `createInsertSchema`.
        *   Omits: `id`. (This is auto-generated).
        *   `title`: `string` - Required.
        *   `description`: `string` - Optional.
        *   `date`: `Date` - Required.
        *   `location`: `string` - Required.
        *   `ticketPrice`: `number` - Optional, defaults to 0.
        *   `organizer`: `string` - Optional.
        *   `streamUrl`: `string` - Optional.
        *   `created_by_id`: `number` - Optional. (Handled by application logic based on logged-in user).
        *   Extended with:
            *   `isVirtual`: `boolean` - Optional, defaults to `false`.
            *   `isFree`: `boolean` - Optional, defaults to `true`.
            *   `category`: Zod enum `['poetry', 'book_launch', 'workshop', 'lecture', 'general']` - Optional, defaults to `'general'`.
*   **TypeScript Types:**
    *   `Event = typeof events.$inferSelect;` (Select model for fetching event data)
    *   `InsertEvent = z.infer<typeof insertEventSchema>;` (Type for data to insert a new event)

### 2.6. ChatRoom Model

*   **Model Name:** `ChatRoom`
*   **Associated Table:** `chat_rooms`
*   **Attributes:**
    *   `id`: `number` (from `serial`)
    *   `name`: `string` (from `text`)
    *   `description`: `string | null` (from `text`)
    *   `created_by_id`: `number | null` (from `integer`)
    *   `isPrivate`: `boolean` (from `boolean`)
*   **Validation Schemas:**
    *   **`insertChatRoomSchema`**: Used for validating data when a new chat room is created. Derived from `chatRooms` table schema using `createInsertSchema`.
        *   Omits: `id`, `created_by_id`. (These are auto-generated or context-dependent).
        *   `name`: `string` - Required.
        *   `description`: `string` - Optional.
        *   `isPrivate`: `boolean` - Optional, defaults to `false`.
*   **TypeScript Types:**
    *   `ChatRoom = typeof chatRooms.$inferSelect;` (Select model for fetching chat room data)
    *   `InsertChatRoom = z.infer<typeof insertChatRoomSchema>;` (Type for data to insert a new chat room)

### 2.7. ChatMessage Model

*   **Model Name:** `ChatMessage`
*   **Associated Table:** `chat_messages`
*   **Attributes:**
    *   `id`: `number` (from `serial`)
    *   `room_id`: `number` (from `integer`)
    *   `user_id`: `number` (from `integer`)
    *   `message`: `string` (from `text`)
    *   `createdAt`: `Date` (from `timestamp`)
*   **Validation Schemas:**
    *   **`insertChatMessageSchema`**: Used for validating data when a new chat message is sent. Derived from `chatMessages` table schema using `createInsertSchema`.
        *   Omits: `id`, `createdAt`. (These are auto-generated or defaulted).
        *   `room_id`: `number` - Required. (Implicitly from table schema).
        *   `user_id`: `number` - Required. (Implicitly from table schema, usually context-dependent).
        *   `message`: `string` - Required.
*   **TypeScript Types:**
    *   `ChatMessage = typeof chatMessages.$inferSelect;` (Select model for fetching chat message data)
    *   `InsertChatMessage = z.infer<typeof insertChatMessageSchema>;` (Type for data to insert a new chat message)

### 2.8. AcademicResource Model

*   **Model Name:** `AcademicResource`
*   **Associated Table:** `academic_resources`
*   **Attributes:**
    *   `id`: `number` (from `serial`)
    *   `title`: `string` (from `text`)
    *   `description`: `string | null` (from `text`)
    *   `type`: `string` (from `text`) - e.g., "study_guide", "video", "career_guide".
    *   `subject`: `string | null` (from `text`)
    *   `gradeLevel`: `string | null` (from `text`)
    *   `language`: `string` (from `text`)
    *   `resourceUrl`: `string | null` (from `text`)
*   **Validation Schemas:**
    *   **`insertAcademicResourceSchema`**: Used for validating data when a new academic resource is added. Derived from `academicResources` table schema using `createInsertSchema`.
        *   Omits: `id`. (This is auto-generated).
        *   `title`: `string` - Required.
        *   `description`: `string` - Optional.
        *   `type`: `string` - Required.
        *   `subject`: `string` - Optional.
        *   `gradeLevel`: `string` - Optional.
        *   `language`: `string` - Optional, defaults to "English" in the database.
        *   `resourceUrl`: `string` - Optional.
*   **TypeScript Types:**
    *   `AcademicResource = typeof academicResources.$inferSelect;` (Select model for fetching academic resource data)
    *   `InsertAcademicResource = z.infer<typeof insertAcademicResourceSchema>;` (Type for data to insert a new academic resource)

### 2.9. Payment Model

*   **Model Name:** `Payment`
*   **Associated Table:** `payments`
*   **Attributes:**
    *   `id`: `number` (from `serial`)
    *   `user_id`: `number` (from `integer`)
    *   `event_id`: `number` (from `integer`)
    *   `amount`: `number` (from `integer`)
    *   `currency`: `string` (from `text`)
    *   `status`: `string` (from `text`) - e.g., "pending", "completed", "refunded", "failed".
    *   `paddlepayment_id`: `string | null` (from `text`)
    *   `paddleTransactionId`: `string | null` (from `text`)
    *   `createdAt`: `Date` (from `timestamp`)
    *   `updatedAt`: `Date` (from `timestamp`)
    *   `refundReason`: `string | null` (from `text`)
*   **Validation Schemas:**
    *   **`insertPaymentSchema`**: Used for validating data when a new payment is created. Derived from `payments` table schema using `createInsertSchema`.
        *   Omits: `id`, `paddlepayment_id`, `paddleTransactionId`, `createdAt`, `updatedAt`, `refundReason`. (These are auto-generated, set by payment provider, or context-dependent).
        *   `user_id`: `number` - Required.
        *   `event_id`: `number` - Required.
        *   `amount`: `number` - Required.
        *   `currency`: `string` - Optional, defaults to "USD" in the database.
        *   `status`: `string` - Required.
*   **TypeScript Types:**
    *   `Payment = typeof payments.$inferSelect;` (Select model for fetching payment data)
    *   `InsertPayment = z.infer<typeof insertPaymentSchema>;` (Type for data to insert a new payment)

### 2.10. Ticket Model

*   **Model Name:** `Ticket`
*   **Associated Table:** `tickets`
*   **Attributes:**
    *   `id`: `number` (from `serial`)
    *   `event_id`: `number` (from `integer`)
    *   `user_id`: `number` (from `integer`)
    *   `purchaseDate`: `Date` (from `timestamp`)
    *   `ticketCode`: `string` (from `text`)
    *   `status`: `string` (from `text`) - e.g., "active", "cancelled", "used".
    *   `payment_id`: `number | null` (from `integer`)
    *   `isRefunded`: `boolean` (from `boolean`)
*   **Validation Schemas:**
    *   **`insertTicketSchema`**: Used for validating data when a new ticket is created. Derived from `tickets` table schema using `createInsertSchema`.
        *   Omits: `id`, `purchaseDate`, `ticketCode`, `status`, `isRefunded`. (These are auto-generated or defaulted by the database/application logic).
        *   `event_id`: `number` - Required.
        *   `user_id`: `number` - Required.
        *   `payment_id`: `number` - Optional.
*   **TypeScript Types:**
    *   `Ticket = typeof tickets.$inferSelect;` (Select model for fetching ticket data)
    *   `InsertTicket = z.infer<typeof insertTicketSchema>;` (Type for data to insert a new ticket)

### 2.11. UserPoem Model

*   **Model Name:** `UserPoem` (Implicit, as no specific `UserPoem` type is exported, but `userPoems` table is used for interactions)
*   **Associated Table:** `user_poems`
*   **Attributes:**
    *   `id`: `number` (from `serial`)
    *   `user_id`: `number` (from `integer`)
    *   `poem_id`: `number` (from `integer`)
    *   `rating`: `number | null` (from `integer`)
    *   `liked`: `boolean` (from `boolean`)
*   **Validation Schemas:**
    *   No explicit `insertUserPoemSchema` is defined in the provided `shared/schema.ts`. Interactions are likely handled directly or via a more generic schema if applicable.
*   **TypeScript Types:**
    *   `UserPoem` is not explicitly defined as a top-level exported type. However, one could infer its structure from `typeof userPoems.$inferSelect`.

### 2.12. UserChatRoom Model

*   **Model Name:** `UserChatRoom`
*   **Associated Table:** `user_chat_rooms`
*   **Attributes:**
    *   `id`: `number` (from `serial`)
    *   `user_id`: `number` (from `integer`)
    *   `room_id`: `number` (from `integer`)
    *   `joinedAt`: `Date` (from `timestamp`)
*   **Validation Schemas:**
    *   No explicit `insertUserChatRoomSchema` is defined in the provided `shared/schema.ts`. Interactions (like joining a room) are likely handled by specific service logic which might use parts of the main `UserChatRoom` type or direct values.
*   **TypeScript Types:**
    *   `UserChatRoom = typeof userChatRooms.$inferSelect;` (Select model for fetching user chat room link data)

### 2.13. PoemComment Model

*   **Model Name:** `PoemComment`
*   **Associated Table:** `poem_comments`
*   **Attributes:**
    *   `id`: `number` (from `serial`)
    *   `poem_id`: `number` (from `integer`)
    *   `user_id`: `number` (from `integer`)
    *   `content`: `string` (from `text`)
    *   `createdAt`: `Date` (from `timestamp`)
*   **Validation Schemas:**
    *   **`insertPoemCommentSchema`**: Used for validating data when a new comment is added to a poem. Derived from `poemComments` table schema using `createInsertSchema`.
        *   Omits: `id`, `user_id`, `createdAt`. (These are auto-generated or context-dependent).
        *   `poem_id`: `number` - Required. (Implicitly from table schema, often part of the route/context).
        *   `content`: `string` - Required.
*   **TypeScript Types:**
    *   `PoemComment = typeof poemComments.$inferSelect;` (Select model for fetching poem comment data)
    *   `InsertPoemComment = z.infer<typeof insertPoemCommentSchema>;` (Type for data to insert a new poem comment)

### 2.14. CommentReaction Model

*   **Model Name:** `CommentReaction`
*   **Associated Table:** `poem_comment_reactions`
*   **Attributes:**
    *   `id`: `number` (from `serial`)
    *   `comment_id`: `number` (from `integer`)
    *   `user_id`: `number` (from `integer`)
    *   `reaction`: `string` (from `text`) - e.g., "like", "love", "laugh", "angry".
    *   `createdAt`: `Date` (from `timestamp`)
*   **Validation Schemas:**
    *   **`insertCommentReactionSchema`**: Used for validating data when a new reaction is added to a comment. Derived from `commentReactions` table schema using `createInsertSchema`.
        *   Omits: `id`, `user_id`, `createdAt`. (These are auto-generated or context-dependent).
        *   `comment_id`: `number` - Required. (Implicitly from table schema, often part of the route/context).
        *   `reaction`: `string` - Required.
*   **TypeScript Types:**
    *   `CommentReaction = typeof commentReactions.$inferSelect;` (Select model for fetching comment reaction data)
    *   `InsertCommentReaction = z.infer<typeof insertCommentReactionSchema>;` (Type for data to insert a new comment reaction)

## 3. API Endpoints

This section details the API endpoints available in the application.

### 3.1. Resource: Auth

Endpoints related to user authentication (login, logout, signup, status). These are set up by `setupAuth(app)`. The specific paths and request/response structures for these would be defined within the `setupAuth` function and are not fully detailed in `server/routes.ts` directly, but generally follow standard authentication patterns.

*   **Note:** Detailed documentation for `/api/auth/login`, `/api/auth/logout`, `/api/auth/signup`, `/api/auth/status` would typically be found by inspecting the `setupAuth` function's implementation. Assuming standard behavior:
    *   `/api/auth/signup`: `POST` - Creates a new user. Expects user details (username, password, email).
    *   `/api/auth/login`: `POST` - Logs in a user. Expects credentials (username, password). Sets a session cookie.
    *   `/api/auth/logout`: `POST` or `GET` - Logs out the current user. Clears the session.
    *   `/api/auth/status`: `GET` - Returns the authentication status of the current user, often including user details if authenticated.

### 3.2. Resource: Poems

#### GET /api/poems
*   **Method:** `GET`
*   **Path:** `/api/poems`
*   **Description:** Fetches a list of all approved poems, with author details. Can be limited by a query parameter.
*   **Authentication:** None
*   **Request Parameters:**
    *   **Query Parameters:**
        *   `limit` (optional, number): Maximum number of poems to return.
*   **Response:**
    *   **Success (200 OK):** Array of poem objects.
        ```json
        [
          {
            "id": 1,
            "title": "Poem Title",
            "content": "Poem content...",
            "author_id": 1,
            "createdAt": "2023-01-01T12:00:00.000Z",
            "isVideo": false,
            "videoUrl": null,
            "approved": true,
            "author": { "id": 1, "username": "author_username" }
          }
          // ... more poems
        ]
        ```
    *   **Error (500 Internal Server Error):** If there's an issue fetching poems.

#### GET /api/poems/user
*   **Method:** `GET`
*   **Path:** `/api/poems/user`
*   **Description:** Fetches all poems created by the currently authenticated user, with author details.
*   **Authentication:** Authenticated User
*   **Request Parameters:** None
*   **Response:**
    *   **Success (200 OK):** Array of poem objects (structure similar to `GET /api/poems`).
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (404 Not Found):** If no poems are found for the user.
    *   **Error (500 Internal Server Error):** If there's an issue fetching poems.

#### GET /api/poems/:id
*   **Method:** `GET`
*   **Path:** `/api/poems/:id`
*   **Description:** Fetches a single poem by its ID, with author details.
*   **Authentication:** None
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the poem to retrieve.
*   **Response:**
    *   **Success (200 OK):** A single poem object.
        ```json
        {
          "id": 1,
          "title": "Poem Title",
          "content": "Poem content...",
          "author_id": 1,
          "createdAt": "2023-01-01T12:00:00.000Z",
          "isVideo": false,
          "videoUrl": null,
          "approved": true,
          "author": { "id": 1, "username": "author_username" }
        }
        ```
    *   **Error (404 Not Found):** If the poem with the specified ID doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue fetching the poem.

#### POST /api/poems
*   **Method:** `POST`
*   **Path:** `/api/poems`
*   **Description:** Creates a new poem. The author will be the authenticated user.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Request Body:** JSON object matching `insertPoemSchema`.
        ```json
        {
          "title": "New Poem",
          "content": "Content of the new poem.",
          "isVideo": false, // optional
          "videoUrl": null // optional
        }
        ```
*   **Response:**
    *   **Success (201 Created):** The newly created poem object.
        ```json
        {
          "id": 2,
          "title": "New Poem",
          "content": "Content of the new poem.",
          "author_id": 5, // ID of the authenticated user
          "createdAt": "2023-01-02T14:30:00.000Z",
          "isVideo": false,
          "videoUrl": null,
          "approved": true // Default, actual value depends on admin approval status.
        }
        ```
    *   **Error (400 Bad Request):** If request body validation fails (ZodError).
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (500 Internal Server Error):** If there's an issue creating the poem.

#### PATCH /api/poems/:id
*   **Method:** `PATCH`
*   **Path:** `/api/poems/:id`
*   **Description:** Updates an existing poem. Only poem owner or an Admin can update.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the poem to update.
    *   **Request Body:** JSON object with fields to update (e.g., `title`, `content`, `isVideo`, `videoUrl`).
        ```json
        {
          "title": "Updated Title", // optional
          "content": "Updated content." // optional
        }
        ```
*   **Response:**
    *   **Success (200 OK):** The updated poem object.
    *   **Error (400 Bad Request):** If no valid fields to update are provided.
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (403 Forbidden):** If the user is not the owner of the poem and not an admin.
    *   **Error (404 Not Found):** If the poem with the specified ID doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue updating the poem.

#### DELETE /api/poems/:id
*   **Method:** `DELETE`
*   **Path:** `/api/poems/:id` (Note: There's a duplicate declaration `app.delete("/api/admin/poems/:id", isAdmin, ...)` which is more specific for admin deletion. This one allows owner deletion too.)
*   **Description:** Deletes a poem. Only poem owner or an Admin can delete.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the poem to delete.
*   **Response:**
    *   **Success (200 OK):**
        ```json
        {
          "message": "Poem deleted successfully"
        }
        ```
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (403 Forbidden):** If the user is not the owner of the poem and not an admin.
    *   **Error (404 Not Found):** If the poem with the specified ID doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue deleting the poem.

#### POST /api/poems/:id/approve
*   **Method:** `POST`
*   **Path:** `/api/poems/:id/approve`
*   **Description:** Approves a poem.
*   **Authentication:** Admin Only
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the poem to approve.
*   **Response:**
    *   **Success (200 OK):** The approved poem object.
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (403 Forbidden):** If the authenticated user is not an admin.
    *   **Error (404 Not Found):** If the poem with the specified ID doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue approving the poem.

#### POST /api/poems/:id/rate
*   **Method:** `POST`
*   **Path:** `/api/poems/:id/rate`
*   **Description:** Rates a poem.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the poem to rate.
    *   **Request Body:**
        ```json
        {
          "rating": 4 // number between 1 and 5
        }
        ```
*   **Response:**
    *   **Success (200 OK):** Empty response.
    *   **Error (400 Bad Request):** If the rating is not a number between 1 and 5.
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (500 Internal Server Error):** If there's an issue rating the poem.

#### POST /api/poems/:id/like
*   **Method:** `POST`
*   **Path:** `/api/poems/:id/like`
*   **Description:** Likes a poem.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the poem to like.
*   **Response:**
    *   **Success (200 OK):**
        ```json
        {
          "message": "Poem liked successfully",
          "likeCount": 15
        }
        ```
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (500 Internal Server Error):** If there's an issue liking the poem.

#### POST /api/poems/:id/unlike
*   **Method:** `POST`
*   **Path:** `/api/poems/:id/unlike`
*   **Description:** Unlikes a poem.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the poem to unlike.
*   **Response:**
    *   **Success (200 OK):**
        ```json
        {
          "message": "Poem unliked successfully",
          "likeCount": 14
        }
        ```
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (500 Internal Server Error):** If there's an issue unliking the poem.

#### GET /api/poems/:id/likes
*   **Method:** `GET`
*   **Path:** `/api/poems/:id/likes`
*   **Description:** Gets the like count for a specific poem.
*   **Authentication:** None
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the poem.
*   **Response:**
    *   **Success (200 OK):**
        ```json
        {
          "likeCount": 14
        }
        ```
    *   **Error (500 Internal Server Error):** If there's an issue fetching the like count.

#### GET /api/poems/:id/user-status
*   **Method:** `GET`
*   **Path:** `/api/poems/:id/user-status`
*   **Description:** Gets the authenticated user's like status and rating for a specific poem.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the poem.
*   **Response:**
    *   **Success (200 OK):**
        ```json
        {
          "liked": true,
          "rating": 4 // or null if not rated
        }
        ```
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (500 Internal Server Error):** If there's an issue fetching the user status.

### 3.3. Resource: Poem Comments

#### GET /api/poems/:id/comments
*   **Method:** `GET`
*   **Path:** `/api/poems/:id/comments`
*   **Description:** Fetches all comments for a specific poem, including user details for each comment.
*   **Authentication:** None
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the poem for which to retrieve comments.
*   **Response:**
    *   **Success (200 OK):** Array of comment objects.
        ```json
        [
          {
            "id": 1,
            "poem_id": 1,
            "user_id": 2,
            "content": "This is a great poem!",
            "createdAt": "2023-01-03T10:00:00.000Z",
            "user": { "id": 2, "username": "commenter_username" }
          }
          // ... more comments
        ]
        ```
    *   **Error (500 Internal Server Error):** If there's an issue fetching comments.

#### POST /api/poems/:id/comments
*   **Method:** `POST`
*   **Path:** `/api/poems/:id/comments`
*   **Description:** Creates a new comment on a specific poem. The commenter will be the authenticated user.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the poem to comment on.
    *   **Request Body:**
        ```json
        {
          "content": "My new comment on this poem."
        }
        ```
        (Note: `poem_id` is taken from the path, `user_id` from `req.user`. The schema used is `insertPoemCommentSchema` which expects `poem_id` and `content`.)
*   **Response:**
    *   **Success (201 Created):** The newly created comment object, including user details.
        ```json
        {
          "id": 3,
          "poem_id": 1,
          "user_id": 5, // ID of the authenticated user
          "content": "My new comment on this poem.",
          "createdAt": "2023-01-03T11:00:00.000Z",
          "user": { "id": 5, "username": "current_user" }
        }
        ```
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (404 Not Found):** If the poem with the specified ID doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue creating the comment.

#### DELETE /api/poems/comments/:id
*   **Method:** `DELETE`
*   **Path:** `/api/poems/comments/:id`
*   **Description:** Deletes a specific comment. The code mentions "ideally check if the user is either the comment creator or an admin but for simplicity in this implementation we'll allow any authenticated user to delete comments."
*   **Authentication:** Authenticated User (Ideally: Comment Owner or Admin)
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the comment to delete.
*   **Response:**
    *   **Success (200 OK):**
        ```json
        {
          "message": "Comment deleted successfully"
        }
        ```
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (404 Not Found):** If the comment with the specified ID doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue deleting the comment.

### 3.4. Resource: Comment Reactions

#### GET /api/comments/:id/reactions
*   **Method:** `GET`
*   **Path:** `/api/comments/:id/reactions`
*   **Description:** Fetches all reactions for a specific comment.
*   **Authentication:** None
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the comment for which to retrieve reactions.
*   **Response:**
    *   **Success (200 OK):** Array of reaction objects.
        ```json
        [
          {
            "id": 1,
            "comment_id": 1,
            "user_id": 2,
            "reaction": "like",
            "createdAt": "2023-01-04T09:00:00.000Z"
          }
          // ... more reactions
        ]
        ```
    *   **Error (500 Internal Server Error):** If there's an issue fetching reactions.

#### GET /api/comments/:id/reaction-counts
*   **Method:** `GET`
*   **Path:** `/api/comments/:id/reaction-counts`
*   **Description:** Fetches the counts of each reaction type for a specific comment.
*   **Authentication:** None
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the comment.
*   **Response:**
    *   **Success (200 OK):**
        ```json
        {
          "like": 10,
          "love": 5
          // ... other reaction types and their counts
        }
        ```
    *   **Error (500 Internal Server Error):** If there's an issue fetching reaction counts.

#### GET /api/comments/reactions
*   **Method:** `GET`
*   **Path:** `/api/comments/reactions`
*   **Description:** Fetches reaction counts and the current user's reaction for multiple comments at once.
*   **Authentication:** Optional (Authenticated User to get `userReaction`)
*   **Request Parameters:**
    *   **Query Parameters:**
        *   `comment_ids` (string): Comma-separated string of comment IDs (e.g., "1,2,3"). Required.
*   **Response:**
    *   **Success (200 OK):**
        ```json
        {
          "1": { // Comment ID
            "counts": { "like": 5, "love": 2 },
            "userReaction": "like" // or null if not authenticated or no reaction by user
          },
          "2": {
            "counts": { "laugh": 3 },
            "userReaction": null
          }
          // ... data for other requested comment IDs
        }
        ```
    *   **Error (400 Bad Request):** If `comment_ids` query parameter is missing.
    *   **Error (500 Internal Server Error):** If there's an issue fetching reactions data.

#### GET /api/comments/:id/user-reaction
*   **Method:** `GET`
*   **Path:** `/api/comments/:id/user-reaction`
*   **Description:** Fetches the authenticated user's reaction to a specific comment.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the comment.
*   **Response:**
    *   **Success (200 OK):** The user's reaction object.
        ```json
        {
          "id": 1,
          "comment_id": 1,
          "user_id": 5,
          "reaction": "love",
          "createdAt": "2023-01-04T10:00:00.000Z"
        }
        ```
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (404 Not Found):** If no reaction is found for the user on this comment.
    *   **Error (500 Internal Server Error):** If there's an issue fetching the user's reaction.

#### POST /api/comments/:id/reactions
*   **Method:** `POST`
*   **Path:** `/api/comments/:id/reactions`
*   **Description:** Adds or updates a reaction to a specific comment for the authenticated user.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the comment to react to.
    *   **Request Body:**
        ```json
        {
          "reaction": "like" // string, e.g., "like", "love"
        }
        ```
        (Note: `comment_id` is from path, `user_id` from `req.user`. The schema used is `insertCommentReactionSchema` which expects `comment_id` and `reaction`.)
*   **Response:**
    *   **Success (201 Created):**
        ```json
        {
          "reaction": {
            "id": 2,
            "comment_id": 1,
            "user_id": 5,
            "reaction": "like",
            "createdAt": "2023-01-04T11:00:00.000Z"
          },
          "counts": { "like": 6, "love": 2 } // Updated reaction counts for the comment
        }
        ```
    *   **Error (400 Bad Request):** If the reaction type is invalid or missing.
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (404 Not Found):** If the comment with the specified ID doesn't exist. (Note: The current code's check for `commentExists` might be too broad; it checks if *any* comment exists in the `poem_comments` table rather than the specific `comment_id`. This should ideally be `storage.getCommentById(comment_id)`).
    *   **Error (500 Internal Server Error):** If there's an issue adding the reaction.

#### DELETE /api/comments/:id/reactions
*   **Method:** `DELETE`
*   **Path:** `/api/comments/:id/reactions`
*   **Description:** Removes the authenticated user's reaction from a specific comment.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the comment from which to remove the reaction.
*   **Response:**
    *   **Success (200 OK):**
        ```json
        {
          "message": "Reaction removed successfully",
          "counts": { "like": 5, "love": 2 } // Updated reaction counts for the comment
        }
        ```
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (404 Not Found):** If no reaction was found for the user on this comment.
    *   **Error (500 Internal Server Error):** If there's an issue removing the reaction.

### 3.5. Resource: Books

#### GET /api/books
*   **Method:** `GET`
*   **Path:** `/api/books`
*   **Description:** Fetches a list of all approved books. Can be limited by a query parameter.
*   **Authentication:** None
*   **Request Parameters:**
    *   **Query Parameters:**
        *   `limit` (optional, number): Maximum number of books to return.
*   **Response:**
    *   **Success (200 OK):** Array of book objects.
        ```json
        [
          {
            "id": 1,
            "title": "Book Title",
            "author": "Book Author",
            "description": "Book description...",
            "coverImage": "/uploads/bookcovers/image.jpg",
            "uploadedById": 1,
            "genre": "Fiction",
            "approved": true
          }
          // ... more books
        ]
        ```
    *   **Error (500 Internal Server Error):** If there's an issue fetching books.

#### GET /api/books/:id
*   **Method:** `GET`
*   **Path:** `/api/books/:id`
*   **Description:** Fetches a single book by its ID.
*   **Authentication:** None
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the book to retrieve.
*   **Response:**
    *   **Success (200 OK):** A single book object.
        ```json
        {
          "id": 1,
          "title": "Book Title",
          "author": "Book Author",
          "description": "Book description...",
          "coverImage": "/uploads/bookcovers/image.jpg",
          "uploadedById": 1,
          "genre": "Fiction",
          "approved": true
        }
        ```
    *   **Error (404 Not Found):** If the book with the specified ID doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue fetching the book.

#### POST /api/upload/bookcover
*   **Method:** `POST`
*   **Path:** `/api/upload/bookcover`
*   **Description:** Uploads a book cover image. Uses `multer` for file handling. Accepts `multipart/form-data`.
*   **Authentication:** Authenticated User
*   **File Uploads:**
    *   Field name: `coverImage`
    *   Accepted file types: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
    *   Max file size: 5MB
    *   Destination: `public/uploads/bookcovers/` (unique filename generated)
*   **Request Parameters:**
    *   **Request Body:** `multipart/form-data` with the image file.
*   **Response:**
    *   **Success (200 OK):**
        ```json
        {
          "success": true,
          "filePath": "/uploads/bookcovers/unique-filename.jpg",
          "message": "File uploaded successfully"
        }
        ```
    *   **Error (400 Bad Request):** If no file is uploaded or file type is incorrect.
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (500 Internal Server Error):** If there's an issue uploading the file.

#### POST /api/books
*   **Method:** `POST`
*   **Path:** `/api/books`
*   **Description:** Creates a new book. The uploader will be the authenticated user.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Request Body:** JSON object matching `insertBookSchema`.
        ```json
        {
          "title": "New Book",
          "author": "Author Name",
          "description": "Description of the book.", // optional
          "coverImage": "/uploads/bookcovers/unique-filename.jpg", // optional, path from /api/upload/bookcover
          "genre": "Science Fiction" // optional
        }
        ```
*   **Response:**
    *   **Success (201 Created):** The newly created book object.
        ```json
        {
          "id": 2,
          "title": "New Book",
          "author": "Author Name",
          "description": "Description of the book.",
          "coverImage": "/uploads/bookcovers/unique-filename.jpg",
          "uploadedById": 5, // ID of the authenticated user
          "genre": "Science Fiction",
          "approved": true // Default, actual value depends on admin approval status.
        }
        ```
    *   **Error (400 Bad Request):** If request body validation fails (ZodError).
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (500 Internal Server Error):** If there's an issue creating the book.

### 3.6. Resource: Events

#### GET /api/events
*   **Method:** `GET`
*   **Path:** `/api/events`
*   **Description:** Fetches a list of all events. Can be limited by query parameter and filtered by category.
*   **Authentication:** None
*   **Request Parameters:**
    *   **Query Parameters:**
        *   `limit` (optional, number): Maximum number of events to return.
        *   `category` (optional, string): Filter events by a specific category (e.g., "poetry", "book_launch").
*   **Response:**
    *   **Success (200 OK):** Array of event objects.
        ```json
        [
          {
            "id": 1,
            "title": "Event Title",
            "description": "Event description...",
            "date": "2023-02-01T19:00:00.000Z",
            "location": "Event Location",
            "ticketPrice": 1000, // In cents or smallest currency unit
            "organizer": "Organizer Name",
            "isVirtual": false,
            "streamUrl": null,
            "isFree": false,
            "created_by_id": 1,
            "category": "poetry"
          }
          // ... more events
        ]
        ```
    *   **Error (500 Internal Server Error):** If there's an issue fetching events.

#### GET /api/events/poetry
*   **Method:** `GET`
*   **Path:** `/api/events/poetry`
*   **Description:** Fetches upcoming poetry events, sorted by date (nearest first).
*   **Authentication:** None
*   **Request Parameters:**
    *   **Query Parameters:**
        *   `limit` (optional, number): Maximum number of poetry events to return.
*   **Response:**
    *   **Success (200 OK):** Array of upcoming poetry event objects (structure similar to `GET /api/events`).
    *   **Error (500 Internal Server Error):** If there's an issue fetching poetry events.

#### GET /api/events/:id
*   **Method:** `GET`
*   **Path:** `/api/events/:id`
*   **Description:** Fetches a single event by its ID.
*   **Authentication:** None
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the event to retrieve.
*   **Response:**
    *   **Success (200 OK):** A single event object (structure similar to `GET /api/events`).
    *   **Error (404 Not Found):** If the event with the specified ID doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue fetching the event.

#### POST /api/events
*   **Method:** `POST`
*   **Path:** `/api/events`
*   **Description:** Creates a new event. The creator will be the authenticated user.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Request Body:** JSON object matching `insertEventSchema`. Date should be in a format parsable by `new Date()`.
        ```json
        {
          "title": "New Event",
          "description": "Details about the new event.", // optional
          "date": "2024-03-15T18:00:00Z", // ISO 8601 format recommended
          "location": "Venue Name or Online",
          "ticketPrice": 0, // optional, defaults to 0
          "organizer": "My Organization", // optional
          "isVirtual": true, // optional, defaults to false
          "streamUrl": "https://zoom.us/j/123", // optional
          "isFree": true, // optional, defaults to true
          "category": "workshop" // optional, defaults to 'general'
        }
        ```
*   **Response:**
    *   **Success (201 Created):** The newly created event object.
    *   **Error (400 Bad Request):** If request body validation fails (ZodError).
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (500 Internal Server Error):** If there's an issue creating the event.

#### PUT /api/events/:id
*   **Method:** `PUT`
*   **Path:** `/api/events/:id`
*   **Description:** Updates an existing event. Only event creator or an Admin can update.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the event to update.
    *   **Request Body:** JSON object matching `insertEventSchema` (all fields required for PUT, or use PATCH for partial updates if available - current code uses PUT for full update).
*   **Response:**
    *   **Success (200 OK):** The updated event object.
    *   **Error (400 Bad Request):** If request body validation fails (ZodError) or event ID is invalid.
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (403 Forbidden):** If the user is not the owner of the event and not an admin.
    *   **Error (404 Not Found):** If the event with the specified ID doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue updating the event.

### 3.7. Resource: Chat Rooms & Messages

#### GET /api/chat/rooms
*   **Method:** `GET`
*   **Path:** `/api/chat/rooms`
*   **Description:** Fetches a list of all available chat rooms.
*   **Authentication:** None
*   **Request Parameters:** None
*   **Response:**
    *   **Success (200 OK):** Array of chat room objects.
        ```json
        [
          {
            "id": 1,
            "name": "General Chat",
            "description": "A place for general discussion.",
            "created_by_id": null, // or user ID if created by a user
            "isPrivate": false
          }
          // ... more rooms
        ]
        ```
    *   **Error (500 Internal Server Error):** If there's an issue fetching chat rooms.

#### GET /api/chat/rooms/:id
*   **Method:** `GET`
*   **Path:** `/api/chat/rooms/:id`
*   **Description:** Fetches a single chat room by its ID.
*   **Authentication:** None
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the chat room to retrieve.
*   **Response:**
    *   **Success (200 OK):** A single chat room object.
    *   **Error (404 Not Found):** If the chat room doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue fetching the room.

#### POST /api/chat/rooms
*   **Method:** `POST`
*   **Path:** `/api/chat/rooms`
*   **Description:** Creates a new chat room. The creator will be the authenticated user.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Request Body:** JSON object matching `insertChatRoomSchema`.
        ```json
        {
          "name": "Poetry Fans Chat",
          "description": "A room for fans of poetry.", // optional
          "isPrivate": false // optional
        }
        ```
*   **Response:**
    *   **Success (201 Created):** The newly created chat room object.
    *   **Error (400 Bad Request):** If request body validation fails (ZodError).
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (500 Internal Server Error):** If there's an issue creating the room.

#### GET /api/chat/rooms/:id/messages
*   **Method:** `GET`
*   **Path:** `/api/chat/rooms/:id/messages`
*   **Description:** Fetches messages for a specific chat room. Includes user details for each message.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the chat room.
*   **Response:**
    *   **Success (200 OK):** Array of chat message objects.
        ```json
        [
          {
            "id": 1,
            "room_id": 1,
            "user_id": 5,
            "message": "Hello everyone!",
            "createdAt": "2023-01-05T10:00:00.000Z",
            "user": { "id": 5, "username": "user_who_sent" }
          }
          // ... more messages
        ]
        ```
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (500 Internal Server Error):** If there's an issue fetching messages.

#### POST /api/chat/rooms/:id/messages
*   **Method:** `POST`
*   **Path:** `/api/chat/rooms/:id/messages`
*   **Description:** Sends a new message to a specific chat room. User must be a member of the room.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the chat room to send the message to.
    *   **Request Body:** JSON object.
        ```json
        {
          "message": "My message content."
          // room_id is from path, user_id from req.user
        }
        ```
        (Note: Uses `insertChatMessageSchema` which expects `room_id`, `user_id`, `message`)
*   **Response:**
    *   **Success (201 Created):** The newly created chat message object.
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (403 Forbidden):** If the user is not a member of the chat room.
    *   **Error (500 Internal Server Error):** If there's an issue creating the message.

#### GET /api/user/chat/rooms
*   **Method:** `GET`
*   **Path:** `/api/user/chat/rooms`
*   **Description:** Fetches all chat rooms the authenticated user has joined.
*   **Authentication:** Authenticated User
*   **Request Parameters:** None
*   **Response:**
    *   **Success (200 OK):** Array of user chat room link objects (likely includes room details).
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (500 Internal Server Error):** If there's an issue fetching user's rooms.

#### POST /api/chat/rooms/:id/join
*   **Method:** `POST`
*   **Path:** `/api/chat/rooms/:id/join`
*   **Description:** Allows the authenticated user to join a chat room.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the chat room to join.
*   **Response:**
    *   **Success (200 OK):**
        ```json
        {
          "success": true,
          "message": "Joined chat room successfully",
          "room": { /* chat room object */ }
        }
        ```
    *   **Error (400 Bad Request):** If failed to join (e.g., already a member, room is private and no invite).
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (500 Internal Server Error):** If there's an issue joining the room.

#### POST /api/chat/rooms/:id/leave
*   **Method:** `POST`
*   **Path:** `/api/chat/rooms/:id/leave`
*   **Description:** Allows the authenticated user to leave a chat room.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the chat room to leave.
*   **Response:**
    *   **Success (200 OK):**
        ```json
        {
          "success": true,
          "message": "Left chat room successfully"
        }
        ```
    *   **Error (400 Bad Request):** If failed to leave (e.g., not a member).
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (500 Internal Server Error):** If there's an issue leaving the room.

#### GET /api/chat/rooms/:id/membership
*   **Method:** `GET`
*   **Path:** `/api/chat/rooms/:id/membership`
*   **Description:** Checks if the authenticated user is a member of a specific chat room.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the chat room.
*   **Response:**
    *   **Success (200 OK):**
        ```json
        {
          "isMember": true // or false
        }
        ```
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (500 Internal Server Error):** If there's an issue checking membership.

### 3.8. Resource: Academic Resources

#### GET /api/academic-resources
*   **Method:** `GET`
*   **Path:** `/api/academic-resources`
*   **Description:** Fetches a list of academic resources. Can be limited by a query parameter.
*   **Authentication:** None
*   **Request Parameters:**
    *   **Query Parameters:**
        *   `limit` (optional, number): Maximum number of resources to return.
*   **Response:**
    *   **Success (200 OK):** Array of academic resource objects.
        ```json
        [
          {
            "id": 1,
            "title": "Study Guide for Poetry",
            "description": "A comprehensive guide.",
            "type": "study_guide",
            "subject": "Literature",
            "gradeLevel": "University",
            "language": "English",
            "resourceUrl": "https://example.com/guide.pdf"
          }
          // ... more resources
        ]
        ```
    *   **Error (500 Internal Server Error):** If there's an issue fetching resources.

#### GET /api/academic-resources/:id
*   **Method:** `GET`
*   **Path:** `/api/academic-resources/:id`
*   **Description:** Fetches a single academic resource by its ID.
*   **Authentication:** None
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the academic resource.
*   **Response:**
    *   **Success (200 OK):** A single academic resource object.
    *   **Error (404 Not Found):** If the resource doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue fetching the resource.

#### POST /api/academic-resources
*   **Method:** `POST`
*   **Path:** `/api/academic-resources`
*   **Description:** Creates a new academic resource.
*   **Authentication:** Admin Only
*   **Request Parameters:**
    *   **Request Body:** JSON object matching `insertAcademicResourceSchema`.
        ```json
        {
          "title": "New Career Guide",
          "description": "Tips for careers in writing.",
          "type": "career_guide",
          "subject": "Career Development",
          "gradeLevel": "All",
          "language": "English",
          "resourceUrl": "https://example.com/career-guide.pdf"
        }
        ```
*   **Response:**
    *   **Success (201 Created):** The newly created academic resource object.
    *   **Error (400 Bad Request):** If request body validation fails (ZodError).
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (403 Forbidden):** If the authenticated user is not an admin.
    *   **Error (500 Internal Server Error):** If there's an issue creating the resource.

### 3.9. Resource: Poets (Users) & Following

#### GET /api/poets/featured
*   **Method:** `GET`
*   **Path:** `/api/poets/featured`
*   **Description:** Fetches a list of featured poets (users who have published poems).
*   **Authentication:** None
*   **Request Parameters:**
    *   **Query Parameters:**
        *   `limit` (optional, number, default: 5): Maximum number of featured poets to return.
*   **Response:**
    *   **Success (200 OK):** Array of user objects (poets), potentially with additional fields like `poemCount`.
        ```json
        [
          {
            "id": 1,
            "username": "featured_poet_1",
            // ... other user fields if returned by storage.getFeaturedPoets
            "poemCount": 10 // example additional field
          }
          // ... more poets
        ]
        ```
    *   **Error (500 Internal Server Error):** If there's an issue fetching featured poets.

#### POST /api/poets/:id/follow
*   **Method:** `POST`
*   **Path:** `/api/poets/:id/follow`
*   **Description:** Allows the authenticated user to follow another user (poet).
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the user (poet) to follow.
*   **Response:**
    *   **Success (201 Created):**
        ```json
        {
          "message": "Successfully followed poet",
          "followData": { /* poetFollowers object */ }
        }
        ```
    *   **Error (400 Bad Request):** If the user tries to follow themselves.
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (404 Not Found):** If the poet to follow doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue processing the follow request.

#### POST /api/poets/:id/unfollow
*   **Method:** `POST`
*   **Path:** `/api/poets/:id/unfollow`
*   **Description:** Allows the authenticated user to unfollow another user (poet).
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the user (poet) to unfollow.
*   **Response:**
    *   **Success (200 OK):**
        ```json
        {
          "message": "Successfully unfollowed poet"
        }
        ```
    *   **Error (400 Bad Request):** If the user is not currently following this poet.
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (404 Not Found):** If the poet to unfollow doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue processing the unfollow request.

#### GET /api/poets/:id/followers
*   **Method:** `GET`
*   **Path:** `/api/poets/:id/followers`
*   **Description:** Fetches the list of followers for a specific user (poet) and the total count.
*   **Authentication:** None
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the user (poet).
*   **Response:**
    *   **Success (200 OK):**
        ```json
        {
          "followers": [ /* array of user objects (followers) */ ],
          "count": 25
        }
        ```
    *   **Error (404 Not Found):** If the poet doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue fetching followers.

#### GET /api/user/followed-poets
*   **Method:** `GET`
*   **Path:** `/api/user/followed-poets`
*   **Description:** Fetches the list of poets that the authenticated user is following.
*   **Authentication:** Authenticated User
*   **Request Parameters:** None
*   **Response:**
    *   **Success (200 OK):** Array of user objects (poets the user follows).
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (500 Internal Server Error):** If there's an issue fetching followed poets.

#### GET /api/poets/:id/following-status
*   **Method:** `GET`
*   **Path:** `/api/poets/:id/following-status`
*   **Description:** Checks if the authenticated user is following a specific poet.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the poet to check.
*   **Response:**
    *   **Success (200 OK):**
        ```json
        {
          "isFollowing": true // or false
        }
        ```
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (500 Internal Server Error):** If there's an issue checking the status.

### 3.10. Resource: Tickets & Payments

#### POST /api/tickets/purchase (Deprecated or General Purpose)
*   **Method:** `POST`
*   **Path:** `/api/tickets/purchase`
*   **Description:** Creates a ticket for an event for the authenticated user. This seems like a general purpose endpoint; for free events, `/api/tickets` is also available. Payment processing is implied to be basic or handled elsewhere.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Request Body:**
        ```json
        {
          "event_id": 123 // number, required
        }
        ```
*   **Response:**
    *   **Success (201 Created):** The newly created ticket object.
    *   **Error (400 Bad Request):** If `event_id` is missing.
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (404 Not Found):** If the event doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue purchasing the ticket.

#### POST /api/tickets (Primarily for Free Event Registration)
*   **Method:** `POST`
*   **Path:** `/api/tickets`
*   **Description:** Creates a ticket for an event, typically used for free event registration. The user ID is taken from the authenticated session.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Request Body:**
        ```json
        {
          "event_id": 123, // number, required
          "user_id": 5 // Though present in body example in code, it's overridden by req.user.user_id
        }
        ```
*   **Response:**
    *   **Success (201 Created):** The newly created ticket object.
    *   **Error (400 Bad Request):** If `event_id` is missing.
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (404 Not Found):** If the event doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue creating the ticket.

#### GET /api/tickets
*   **Method:** `GET`
*   **Path:** `/api/tickets`
*   **Description:** Fetches all tickets for the authenticated user, with event details for each ticket.
*   **Authentication:** Authenticated User
*   **Request Parameters:** None
*   **Response:**
    *   **Success (200 OK):** Array of ticket objects, each including an `event` object.
        ```json
        [
          {
            "id": 1,
            "event_id": 1,
            "user_id": 5,
            "purchaseDate": "2023-01-06T12:00:00.000Z",
            "ticketCode": "UNIQUECODE123",
            "status": "active",
            "payment_id": null,
            "isRefunded": false,
            "event": { /* event object */ }
          }
          // ... more tickets
        ]
        ```
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (500 Internal Server Error):** If there's an issue fetching tickets.

#### GET /api/tickets/user
*   **Method:** `GET`
*   **Path:** `/api/tickets/user`
*   **Description:** Fetches all tickets for the authenticated user. Similar to `GET /api/tickets`. Returns an empty array if no tickets.
*   **Authentication:** Authenticated User
*   **Request Parameters:** None
*   **Response:**
    *   **Success (200 OK):** Array of ticket objects with event details, or an empty array.
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (500 Internal Server Error):** If there's an issue fetching tickets.

#### GET /api/tickets/:id
*   **Method:** `GET`
*   **Path:** `/api/tickets/:id`
*   **Description:** Fetches a single ticket by its ID, including event details. Only the ticket owner or an admin can view.
*   **Authentication:** Authenticated User (Owner or Admin)
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the ticket to retrieve.
*   **Response:**
    *   **Success (200 OK):** A single ticket object with event details.
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (403 Forbidden):** If the user is not the owner and not an admin.
    *   **Error (404 Not Found):** If the ticket doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue fetching the ticket.

#### POST /api/payments
*   **Method:** `POST`
*   **Path:** `/api/payments`
*   **Description:** Creates a new payment record. Typically used before redirecting to a payment provider or after receiving payment confirmation.
*   **Authentication:** Authenticated User
*   **Request Parameters:**
    *   **Request Body:** JSON object matching `insertPaymentSchema`.
        ```json
        {
          "user_id": 5, // Must match authenticated user
          "event_id": 1,
          "amount": 1500, // In cents or smallest currency unit
          "currency": "USD", // optional, defaults to USD
          "status": "pending" // initial status
        }
        ```
*   **Response:**
    *   **Success (201 Created):** The newly created payment object.
    *   **Error (400 Bad Request):** If request body validation fails (ZodError).
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (403 Forbidden):** If `user_id` in body does not match authenticated user.
    *   **Error (404 Not Found):** If the event doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue creating the payment.

#### PATCH /api/payments/:id/status
*   **Method:** `PATCH`
*   **Path:** `/api/payments/:id/status`
*   **Description:** Updates the status of a payment. Can only be done by the payment owner or an admin. If status becomes "completed", a ticket is created.
*   **Authentication:** Authenticated User (Owner or Admin)
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the payment to update.
    *   **Request Body:**
        ```json
        {
          "status": "completed" // "pending", "completed", "refunded", "failed"
        }
        ```
*   **Response:**
    *   **Success (200 OK):** The updated payment object. If status became "completed", also includes the created `ticket` object.
        ```json
        {
          "payment": { /* updated payment object */ },
          "ticket": { /* new ticket object, if created */ }
        }
        ```
    *   **Error (400 Bad Request):** If the status is invalid.
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (403 Forbidden):** If the user is not the owner and not an admin.
    *   **Error (404 Not Found):** If the payment doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue updating status or creating a ticket.

#### PATCH /api/payments/:id/refund
*   **Method:** `PATCH`
*   **Path:** `/api/payments/:id/refund`
*   **Description:** Processes a refund for a payment. Updates payment status and associated ticket.
*   **Authentication:** Authenticated User (Owner or Admin)
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the payment to refund.
    *   **Request Body:**
        ```json
        {
          "reason": "User requested refund due to event cancellation." // required
        }
        ```
*   **Response:**
    *   **Success (200 OK):**
        ```json
        {
          "message": "Refund processed successfully",
          "payment": { /* updated payment object with refundReason and status 'refunded' */ }
        }
        ```
    *   **Error (400 Bad Request):** If `reason` is missing.
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (403 Forbidden):** If the user is not the owner and not an admin.
    *   **Error (404 Not Found):** If the payment doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue processing the refund.

#### PATCH /api/tickets/:id/status
*   **Method:** `PATCH`
*   **Path:** `/api/tickets/:id/status`
*   **Description:** Updates the status of a ticket (e.g., "active", "cancelled", "used").
*   **Authentication:** Authenticated User (Owner or Admin)
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the ticket to update.
    *   **Request Body:**
        ```json
        {
          "status": "used" // "active", "cancelled", "used"
        }
        ```
*   **Response:**
    *   **Success (200 OK):** The updated ticket object.
    *   **Error (400 Bad Request):** If the status is invalid or trying to change status of a refunded ticket (unless to 'refunded').
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (403 Forbidden):** If the user is not the owner and not an admin.
    *   **Error (404 Not Found):** If the ticket doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue updating the ticket status.

#### POST /api/tickets/:id/cancel
*   **Method:** `POST`
*   **Path:** `/api/tickets/:id/cancel`
*   **Description:** Cancels a ticket. If the event was paid and a payment is associated, it attempts to process a refund.
*   **Authentication:** Authenticated User (Owner or Admin)
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the ticket to cancel.
    *   **Request Body (optional):**
        ```json
        {
          "reason": "Optional reason for cancellation/refund."
        }
        ```
*   **Response:**
    *   **Success (200 OK):**
        ```json
        // For free event or if no payment to refund
        {
          "ticket": { /* updated ticket object with status 'cancelled' */ },
          "message": "Ticket cancelled successfully"
        }
        // For paid event with successful refund
        {
          "ticket": { /* updated ticket object, marked as refunded */ },
          "payment": { /* updated payment object with status 'refunded' */ },
          "message": "Ticket cancelled and payment refunded successfully"
        }
        ```
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (403 Forbidden):** If the user is not the owner and not an admin.
    *   **Error (404 Not Found):** If the ticket or associated event/payment doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue cancelling the ticket or processing the refund.

### 3.11. Resource: Admin

#### GET /api/admin/users
*   **Method:** `GET`
*   **Path:** `/api/admin/users`
*   **Description:** Fetches a list of all users.
*   **Authentication:** Admin Only
*   **Request Parameters:** None
*   **Response:**
    *   **Success (200 OK):** Array of user objects.
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (403 Forbidden):** If the authenticated user is not an admin.
    *   **Error (500 Internal Server Error):** If there's an issue fetching users.

#### PATCH /api/admin/users/:id
*   **Method:** `PATCH`
*   **Path:** `/api/admin/users/:id`
*   **Description:** Updates a user's admin status.
*   **Authentication:** Admin Only
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the user to update.
    *   **Request Body:**
        ```json
        {
          "isAdmin": true // boolean
        }
        ```
*   **Response:**
    *   **Success (200 OK):** The updated user object.
    *   **Error (400 Bad Request):** If `isAdmin` is not a boolean or if trying to remove own admin privileges.
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (403 Forbidden):** If the authenticated user is not an admin.
    *   **Error (404 Not Found):** If the user doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue updating the user.

#### DELETE /api/admin/users/:id
*   **Method:** `DELETE`
*   **Path:** `/api/admin/users/:id`
*   **Description:** Deletes a user.
*   **Authentication:** Admin Only
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the user to delete.
*   **Response:**
    *   **Success (200 OK):**
        ```json
        {
          "message": "User deleted successfully"
        }
        ```
    *   **Error (400 Bad Request):** If trying to delete own account.
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (403 Forbidden):** If the authenticated user is not an admin.
    *   **Error (404 Not Found):** If the user doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue deleting the user.

#### GET /api/admin/pending/books
*   **Method:** `GET`
*   **Path:** `/api/admin/pending/books`
*   **Description:** Fetches a list of books pending approval.
*   **Authentication:** Admin Only
*   **Request Parameters:** None
*   **Response:**
    *   **Success (200 OK):** Array of book objects that have `approved: false`.
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (403 Forbidden):** If the authenticated user is not an admin.
    *   **Error (500 Internal Server Error):** If there's an issue fetching pending books.

#### GET /api/admin/pending/poems
*   **Method:** `GET`
*   **Path:** `/api/admin/pending/poems`
*   **Description:** Fetches a list of poems pending approval.
*   **Authentication:** Admin Only
*   **Request Parameters:** None
*   **Response:**
    *   **Success (200 OK):** Array of poem objects that have `approved: false`.
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (403 Forbidden):** If the authenticated user is not an admin.
    *   **Error (500 Internal Server Error):** If there's an issue fetching pending poems.

#### PATCH /api/admin/books/:id/approve
*   **Method:** `PATCH`
*   **Path:** `/api/admin/books/:id/approve`
*   **Description:** Approves a book.
*   **Authentication:** Admin Only
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the book to approve.
*   **Response:**
    *   **Success (200 OK):** The approved book object.
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (403 Forbidden):** If the authenticated user is not an admin.
    *   **Error (404 Not Found):** If the book doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue approving the book.

#### DELETE /api/admin/books/:id
*   **Method:** `DELETE`
*   **Path:** `/api/admin/books/:id`
*   **Description:** Deletes a book.
*   **Authentication:** Admin Only
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the book to delete.
*   **Response:**
    *   **Success (200 OK):**
        ```json
        {
          "message": "Book deleted successfully"
        }
        ```
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (403 Forbidden):** If the authenticated user is not an admin.
    *   **Error (404 Not Found):** If the book doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue deleting the book.

#### DELETE /api/admin/poems/:id
*   **Method:** `DELETE`
*   **Path:** `/api/admin/poems/:id`
*   **Description:** Deletes a poem. (This is the admin-specific version of poem deletion).
*   **Authentication:** Admin Only
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:id` (number): The ID of the poem to delete.
*   **Response:**
    *   **Success (200 OK):**
        ```json
        {
          "message": "Poem deleted successfully"
        }
        ```
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (403 Forbidden):** If the authenticated user is not an admin.
    *   **Error (404 Not Found):** If the poem doesn't exist.
    *   **Error (500 Internal Server Error):** If there's an issue deleting the poem.

#### GET /api/admin/tickets/event/:event_id
*   **Method:** `GET`
*   **Path:** `/api/admin/tickets/event/:event_id`
*   **Description:** Fetches all tickets for a specific event, enriching them with user information.
*   **Authentication:** Admin Only
*   **Request Parameters:**
    *   **Path Parameters:**
        *   `:event_id` (number): The ID of the event.
*   **Response:**
    *   **Success (200 OK):** Array of ticket objects, each with a nested `user` object.
        ```json
        [
          {
            // ticket fields ...
            "user": { "id": 1, "username": "user1", "email": "user1@example.com" }
          }
          // ... more tickets
        ]
        ```
    *   **Error (401 Unauthorized):** If the user is not authenticated.
    *   **Error (403 Forbidden):** If the authenticated user is not an admin.
    *   **Error (500 Internal Server Error):** If there's an issue fetching tickets.

### 3.12. Resource: Paddle Webhook (Payments)

#### POST /api/paddle/webhook
*   **Method:** `POST`
*   **Path:** `/api/paddle/webhook`
*   **Description:** Handles incoming webhook events from Paddle payment provider. Primarily for processing payment completions and creating tickets.
*   **Authentication:** None (Relies on webhook security, e.g., signature verification, not shown in this code snippet)
*   **Request Parameters:**
    *   **Request Body:** JSON payload from Paddle.
        ```json
        {
          "event_type": "payment.completed", // or other event types
          "data": {
            "custom_data": {
              "payment_id": "123" // ID of the payment record in local DB
            }
            // ... other Paddle data
          }
        }
        ```
*   **Response:**
    *   **Success (200 OK):**
        ```json
        {
          "success": true
        }
        ```
    *   **Error (500 Internal Server Error):** If there's an issue processing the webhook.

### 3.13. Static File Serving

#### GET /uploads/*
*   **Method:** `GET`
*   **Path:** `/uploads/*` (e.g., `/uploads/bookcovers/filename.jpg`)
*   **Description:** Serves static files (like uploaded book covers) from the `public/uploads` directory.
*   **Authentication:** None
*   **Request Parameters:** Path indicates the file to retrieve.
*   **Response:**
    *   **Success (200 OK):** The requested file.
    *   **Error (404 Not Found):** If the file doesn't exist.

## 4. Authentication and Authorization

### 4.1. Authentication Overview
The backend employs Passport.js, configured with a `LocalStrategy`, to handle user authentication. This strategy validates users based on a username and password combination submitted to the `/api/login` endpoint. Successful authentication establishes a session for the user.

### 4.2. Password Management
*   **Hashing:** Passwords are not stored in plaintext; they are hashed before being saved to the database. The system supports multiple hashing strategies for new and legacy passwords:
    *   For development and testing, a simple, non-secure prefix `dev-hash-` is added to the plain password (e.g., `dev-hash-mypassword`). This is **not suitable for production**.
    *   The primary secure hashing mechanism uses `scrypt`, a cryptographically strong key derivation function.
    *   There is also a provision for comparing against legacy `bcrypt` hashes (specifically checking for `password` if the hash starts with `$2`).
*   **Core Functions (in `server/auth.ts`):**
    *   `hashPassword(password: string)`: This function currently generates the `dev-hash-` prefixed passwords. The more secure `scrypt` logic (commented out in the original `hashPassword` but present in `comparePasswords`) would be used for production hashing.
    *   `comparePasswords(supplied: string, stored: string)`: This function compares a user-supplied password against the stored hash. It intelligently handles the different formats: `dev-hash-`, `scrypt` (identified by a `.` in the stored hash, separating hash and salt), and the legacy `bcrypt` format.

### 4.3. Session Management
*   Sessions are managed using the `express-session` middleware.
*   **Configuration (`server/auth.ts`):**
    *   `secret`: A secret key used to sign the session ID cookie. It defaults to `"elibrary-secret-key"` but should be set via the `SESSION_SECRET` environment variable in production for security.
    *   `resave`: Set to `false`, meaning the session is not saved back to the session store if it was never modified during the request.
    *   `saveUninitialized`: Set to `false`, meaning a session is not stored for unauthenticated users.
    *   `cookie`:
        *   `maxAge`: Sessions are configured to last for 30 days (`30 * 24 * 60 * 60 * 1000` milliseconds).
    *   The application is also configured to trust the first proxy (`app.set("trust proxy", 1);`), which is important if the application is run behind a reverse proxy (e.g., for SSL termination).
*   **Session Store:**
    *   The application uses `MemoryStore` from the `memorystore` library for session storage. This is initialized in `server/DatabaseStorage.ts` (`this.sessionStore = new MemoryStore(...)`) and then passed to `express-session` in `server/auth.ts` via `storage.sessionStore`.
    *   **Important Note:** As `MemoryStore` is used, sessions are stored **in-memory within the server process and are not persisted in the database**. This means that all active sessions will be lost if the server restarts. For a production environment requiring persistent sessions, a database-backed session store (like `connect-pg-simple` for PostgreSQL) would be necessary.

### 4.4. Key Authentication Endpoints
These endpoints are defined in `server/auth.ts`:
*   `/api/register` (POST): Allows new users to sign up. It validates the input (username, email, password, confirmPassword), checks for existing usernames, hashes the password, and creates a new user in the database. Upon successful registration, the user is automatically logged in.
*   `/api/login` (POST): Authenticates existing users using the `LocalStrategy` (username and password). On success, it establishes a session.
*   `/api/logout` (POST): Invalidates the current user's session, effectively logging them out.
*   `/api/user` (GET): Retrieves information about the currently authenticated user (if any). Responds with 401 if no user is authenticated.

### 4.5. Authorization
*   Authorization is primarily managed based on user roles, specifically through the `is_admin` (or `isAdmin` in the `User` model) boolean flag associated with each user in the `users` table.
*   **Middleware Functions (defined in `server/routes.ts`):**
    *   `isAuthenticated`: This middleware function checks if `req.isAuthenticated()` (a Passport.js method) returns `true`. If not, it sends a 401 Unauthorized response. It is used to protect routes that require a logged-in user.
        *   Examples from `server/routes.ts`:
            *   `GET /api/poems/user`
            *   `POST /api/poems`
            *   `PATCH /api/poems/:id`
            *   `POST /api/poems/:id/rate`
            *   `POST /api/books`
            *   `POST /api/events`
            *   `GET /api/tickets`
            *   Many others.
    *   `isAdmin`: This middleware function first checks `req.isAuthenticated()` and then verifies if `req.user.is_admin` (which is `0` or `1` in the `req.user` object from `server/auth.ts` due to the `DBUser` interface mapping) is true (i.e., `1`). If either check fails, it sends a 403 Forbidden response (or 401 if not authenticated at all). This is used for routes that should only be accessible to administrators.
        *   Examples from `server/routes.ts`:
            *   `POST /api/poems/:id/approve`
            *   `POST /api/academic-resources`
            *   `GET /api/admin/users`
            *   `PATCH /api/admin/users/:id`
            *   `DELETE /api/admin/users/:id`
            *   `PATCH /api/admin/books/:id/approve`
            *   `DELETE /api/admin/poems/:id` (admin-specific delete)

## 5. Real-Time Chat Service (WebSockets)

### 5.1. Overview
The application provides real-time chat functionality using WebSockets, implemented with the `ws` library.
*   **Server Path:** WebSocket connections are established on the `/ws` path of the HTTP server.

### 5.2. Connection Handling
*   When a new client connects to the `/ws` path, a WebSocket connection is established. Each connection is assigned a unique `connectionId` for logging and tracking.
*   A heartbeat mechanism is implemented to maintain connection health and detect disconnections:
    *   The server sets an `isAlive` flag to `true` for each connection upon establishment and when a `pong` message is received.
    *   The server periodically (every 30 seconds via `pingInterval`) sends a `ping` message to all connected clients.
    *   If a client does not respond with a `pong` message before the next ping cycle (meaning `isAlive` is `false`), the server terminates the connection.
    *   This helps in cleaning up resources for clients that have disconnected without a proper close handshake.
*   On connection close (either client-initiated or server-terminated), the server cleans up by removing the client from any rooms it was part of and from the `clientData` map.

### 5.3. Authentication
*   Client authentication over WebSockets is initiated by the client sending an `auth` or `authenticate` message after the connection is established.
    ```json
    {
      "type": "auth", // or "authenticate"
      "user_id": 123 // The ID of the user
    }
    ```
*   The server receives this message and uses the provided `user_id` to fetch user details from the database via `storage.getUser()`.
*   If the user is found, their `user_id` and `username` are stored in the `clientData` map, associating the WebSocket connection (the `ws` object itself as the key) with the authenticated user's details.
*   A confirmation message `auth_success` is sent back to the client upon successful authentication.
    ```json
    {
      "type": "auth_success",
      "user_id": 123,
      "username": "user_name"
    }
    ```
*   If authentication fails (e.g., user not found, invalid `user_id`), an error message is sent to the client.

### 5.4. Joining Chat Rooms
*   Authenticated clients can request to join a chat room by sending a `join_room` message.
    ```json
    {
      "type": "join_room",
      "room_id": 1 // The ID of the room to join
    }
    ```
*   The server first checks if the client is authenticated (i.e., present in `clientData`).
*   It then validates the `room_id` by attempting to fetch the room details using `storage.getChatRoomById()`.
*   If successful, the client's WebSocket connection is added to a `Set` of clients for that `room_id` within the `roomClients` map.
*   **Room History:** Upon successfully joining a room, the server fetches past messages for that room using `storage.getChatMessagesByroom_id()`. These messages are formatted and sent to the joining client in a `room_history` message.
    ```json
    {
      "type": "room_history",
      "room_id": 1,
      "messages": [
        { "type": "chat_message", "room_id": 1, "user_id": 10, "username": "Alice", "message": "Hi!", "timestamp": "..." },
        { "type": "chat_message", "room_id": 1, "user_id": 12, "username": "Bob", "message": "Hello!", "timestamp": "..." }
      ]
    }
    ```
*   **Notification:** Other clients already in the room are notified that a new user has joined via a `user_joined` broadcast message (excluding the user who just joined).
    ```json
    {
      "type": "user_joined",
      "room_id": 1,
      "user_id": 123,
      "username": "new_user_name",
      "timestamp": "...",
      "message": "new_user_name joined the room"
    }
    ```

### 5.5. Sending and Receiving Chat Messages
*   Authenticated clients can send chat messages to a room they have joined using a `chat_message` message.
    ```json
    {
      "type": "chat_message",
      "room_id": 1,
      "message": "Hello everyone!"
    }
    ```
*   The server validates that the client is authenticated and that the message content is not empty.
*   The message (containing `room_id`, `user_id` from `clientData`, and the `message` text) is persisted to the database using `storage.createChatMessage()`.
*   A timestamp is generated for the message.
*   **Delivery Confirmation:** The server sends the formatted message (now including `username`, `timestamp`, and a `delivered: true` flag) back to the original sender to confirm it has been processed.
    ```json
    {
      "type": "chat_message",
      "room_id": 1,
      "user_id": 123,
      "username": "sender_username",
      "message": "Hello everyone!",
      "timestamp": "...",
      "delivered": true
    }
    ```
*   **Broadcast:** The same formatted message (without the `delivered` flag, or it can be ignored by other clients) is then broadcast to all other connected clients in the specified `room_id` using the `broadcastToRoom` function.

### 5.6. Other Message Types
*   **`ping`:** Clients can send a `ping` message, to which the server responds with a `pong` message. This is primarily for the client to check its connection status, though the server also has its own ping/pong mechanism for keep-alive.
    ```json
    // Client to Server
    { "type": "ping" }
    // Server to Client
    { "type": "pong" }
    ```

### 5.7. Error Handling
*   The server sends error messages back to the WebSocket client in a structured JSON format when issues occur.
    ```json
    {
      "type": "error",
      "message": "Detailed error message here"
    }
    ```
*   Examples of situations where errors are sent:
    *   Unknown message type received.
    *   Authentication required but client is not authenticated (e.g., for `join_room`, `chat_message`).
    *   Invalid `user_id` during authentication or user not found.
    *   Chat room not found when trying to join or send a message.
    *   Attempting to send an empty chat message.
    *   General errors during message processing.

### 5.8. Key Server-Side Data Structures
*   `roomClients` (Map<number, Set<ExtendedWebSocket>>):
    *   Keys are `room_id` (numbers).
    *   Values are `Set`s of `ExtendedWebSocket` objects, representing all clients currently subscribed to that chat room.
*   `clientData` (Map<ExtendedWebSocket, { user_id: number; username: string }>):
    *   Keys are `ExtendedWebSocket` client objects.
    *   Values are objects containing the `user_id` and `username` of the authenticated user associated with that WebSocket connection.
*   `activeConnections` (Set<ExtendedWebSocket>):
    *   A `Set` of all currently active WebSocket connections, used primarily for the heartbeat mechanism and logging connection counts.
*   `ExtendedWebSocket` (Interface): An extension of the base `WebSocket` type from the `ws` library, adding:
    *   `isAlive: boolean` (for heartbeat tracking).
    *   `connectionId?: number` (for logging and debugging).

## 6. Backend Architecture Overview

The backend is a Node.js application built with Express.js and TypeScript, designed to serve a web application with features like poetry sharing, book listings, event management, and real-time chat.

### 6.1. Core Technologies
*   **Node.js:** JavaScript runtime environment for executing server-side code.
*   **Express.js:** A minimal and flexible Node.js web application framework used for building the API, handling HTTP requests, and managing middleware.
*   **TypeScript:** The primary programming language, providing static typing for better code quality and maintainability.

### 6.2. Project Structure
*   `server/`: Contains all backend-specific logic.
    *   `index.ts`: The main server entry point.
    *   `routes.ts`: Defines API endpoints and integrates various services.
    *   `auth.ts`: Handles user authentication and session management.
    *   `storage.ts`: Defines the `IStorage` interface for data persistence.
    *   `DatabaseStorage.ts`: Implements `IStorage` using Drizzle ORM for PostgreSQL.
    *   `db.ts`: Configures and initializes the Drizzle ORM and PostgreSQL connection pool.
    *   `socketService.ts`: Manages WebSocket connections for real-time chat.
    *   `seed.ts`: Contains logic to populate the database with initial data.
    *   `vite.ts`: Utility functions for Vite integration during development and serving static files in production.
*   `shared/`: Contains code intended to be shared between the frontend and backend.
    *   `schema.ts`: A crucial file defining database table structures using Drizzle ORM, Zod validation schemas for request data, and derived TypeScript types for data models.
*   `migrations/`: Stores SQL migration files automatically generated and managed by Drizzle ORM to track and apply database schema changes.
*   `netlify/`: Contains Netlify serverless function definitions (`netlify/functions/api.ts`, `netlify/functions/websocket.ts`) for deploying the backend.
*   `public/`: Serves static assets directly to clients. It also contains the `uploads/` subdirectory (specifically `public/uploads/bookcovers/`) for user-uploaded files like book cover images.

### 6.3. Database
*   **System:** PostgreSQL is the relational database system used for data storage.
*   **ORM (Object-Relational Mapper):** Drizzle ORM is utilized for all database interactions.
    *   It allows defining database schemas in TypeScript (in `shared/schema.ts`).
    *   It provides a type-safe query builder for interacting with the database.
    *   It handles database migrations through files stored in the `migrations/` directory.
    *   The database connection pool and Drizzle instance are configured and exported from `server/db.ts`.

### 6.4. Key Components and Flow

#### `server/index.ts` (Server Entry Point)
This file acts as the main entry point for the backend application. Its primary responsibilities are:
*   Initializing the Express application (`app = express()`).
*   Setting up global middleware:
    *   `express.json()`: For parsing incoming JSON request bodies.
    *   `express.urlencoded({ extended: false })`: For parsing URL-encoded request bodies.
    *   A custom request logging middleware that logs details about API requests (method, path, status code, duration, and part of the response body).
*   Executing `seedDatabase()` from `server/seed.ts` at startup. This function populates the database with initial data if it's deemed empty (e.g., no users found).
*   Registering all API routes by calling `registerRoutes(app)` from `server/routes.ts`. This function also sets up the HTTP server instance.
*   Configuring a global error handling middleware that catches errors and sends a standardized JSON error response.
*   Integrating Vite for frontend development server capabilities using `setupVite()` (in development mode) or configuring the server to serve static client files using `serveStatic()` (in production mode).
*   Starting the HTTP server (which, through `registerRoutes`, also starts the WebSocket server) to listen on port 5000 on all available network interfaces (`0.0.0.0`).

#### `server/routes.ts` (API Routing)
This file is central to defining the application's API. It performs the following:
*   Initializes authentication by calling `setupAuth(app)` from `server/auth.ts`.
*   Creates an HTTP server instance that wraps the Express app, which is then used for both HTTP and WebSocket connections.
*   Configures `multer` for handling file uploads, specifically for book cover images, storing them in `public/uploads/bookcovers/`.
*   Sets up a static file server for the `/uploads` path to serve these uploaded files.
*   Initializes the WebSocket service by calling `setupWebSocketServer()` from `server/socketService.ts`.
*   Defines custom middleware:
    *   `isAuthenticated`: Checks if a user is logged in via `req.isAuthenticated()`.
    *   `isAdmin`: Checks if the logged-in user has administrative privileges (`req.user.is_admin`).
*   Defines all API endpoints, grouped by resource (e.g., poems, books, events, users/poets, chat, admin).
    *   Route handlers parse request parameters, validate request bodies using Zod schemas from `shared/schema.ts`.
    *   They use the `storage` service (an instance of `DatabaseStorage`) to perform CRUD operations and other business logic.
    *   Appropriate HTTP status codes and JSON responses are sent back to clients.

#### `server/storage.ts` & `server/DatabaseStorage.ts` (Storage Layer)
*   **`server/storage.ts`:**
    *   Defines the `IStorage` interface, which acts as a contract or blueprint for all data storage operations. This promotes loose coupling and allows for different storage implementations (though only `DatabaseStorage` is currently used).
    *   Exports an instance of `DatabaseStorage` as the singleton `storage` object, which is used by route handlers and other services to interact with the database.
*   **`server/DatabaseStorage.ts`:**
    *   Provides the concrete implementation of the `IStorage` interface.
    *   Uses the Drizzle ORM instance (`db` from `server/db.ts`) to execute queries against the PostgreSQL database.
    *   Contains methods for all data access logic, such as creating users, fetching poems, managing chat room memberships, etc.
    *   It also initializes and provides a `MemoryStore` for session management, which is used by `server/auth.ts`.

#### `server/auth.ts` (Authentication)
This module is responsible for user authentication and session management:
*   Configures and initializes Passport.js.
*   Implements a `LocalStrategy` for username/password authentication, validating credentials against data fetched by `storage.getUserByUsername()`.
*   Handles password hashing and comparison using `hashPassword()` and `comparePasswords()`, supporting different hashing strategies.
*   Manages user sessions using `express-session` and the `MemoryStore` provided by `DatabaseStorage`.
*   Defines serialization (`passport.serializeUser`) and deserialization (`passport.deserializeUser`) of user objects for session storage.
*   Provides API endpoints for user registration (`/api/register`), login (`/api/login`), logout (`/api/logout`), and fetching current user status (`/api/user`).
*   Includes Zod schema (`registerSchema`) for validating registration data.

#### `server/socketService.ts` (Real-Time Chat)
This module sets up and manages the WebSocket server for real-time chat functionality:
*   Initializes a `WebSocketServer` instance, attaching it to the main HTTP server on the `/ws` path.
*   Handles new WebSocket connections, including heartbeat mechanisms (ping/pong) to detect and close inactive connections.
*   Manages client authentication over WebSockets, associating WebSocket connections with user IDs.
*   Handles client subscriptions to chat rooms (`join_room` message), storing room memberships.
*   Processes incoming chat messages (`chat_message` type), persists them to the database via the `storage` service, and broadcasts them to other clients in the same room.
*   Sends room history to clients upon joining a room.

#### `shared/schema.ts` (Schema Definitions)
This is a critical shared module containing:
*   Database table definitions using Drizzle ORM's `pgTable` syntax for PostgreSQL. This defines the structure of tables like `users`, `poems`, `books`, `events`, `chatRooms`, etc.
*   Zod schemas (e.g., `insertUserSchema`, `insertPoemSchema`) for validating data, particularly for incoming API requests (create/update operations). These are generated using `createInsertSchema` from Drizzle schemas or defined as custom Zod objects.
*   Exported TypeScript types inferred from the Drizzle table schemas (e.g., `User`, `Poem`) and Zod schemas (e.g., `InsertUser`), ensuring type safety across the backend and potentially the frontend.

### 6.5. Simplified HTTP Request Lifecycle
1.  An HTTP request arrives at the Express server (`server/index.ts`).
2.  Global middleware (custom logging, `express.json()`, `express.urlencoded()`) is applied.
3.  The request is matched to a route defined in `server/routes.ts`.
4.  If the route is protected, `isAuthenticated` and/or `isAdmin` middleware are executed to verify user session and permissions.
5.  The route handler function is invoked. It may validate request body or query parameters using Zod schemas from `shared/schema.ts`.
6.  The handler calls methods on the `storage` object (instance of `DatabaseStorage`) to perform business logic and data operations.
7.  `DatabaseStorage` methods use Drizzle ORM functions to build and execute SQL queries against the PostgreSQL database.
8.  The results from the storage layer are returned to the route handler.
9.  The route handler constructs an appropriate JSON response and sends it back to the client.
10. The custom logging middleware logs the request details after the response is finished.

### 6.6. Database Seeding (`server/seed.ts`)
The `seedDatabase()` function, called on server startup from `server/index.ts`, is responsible for populating the database with initial data.
*   **Condition:** It first checks if users already exist in the database. If so, it skips the seeding process to avoid duplicating data or overwriting existing records.
*   **Data Seeded:**
    *   Creates an 'admin' user and several other predefined users (leon, aaronleon, john) with a default hashed password.
    *   Creates default chat rooms like 'General', 'Poetry', 'Book Club', and 'Events'.
    *   Optionally, if an `events.json` file is present in the project root and the `events` table is empty, it imports event data from this JSON file.
*   This process ensures that a new or reset database instance has the necessary foundational data for the application to be usable immediately after startup, especially for development and testing.

## 7. Deployment (Netlify)

The application is configured for deployment on Netlify, leveraging its serverless functions for the backend API and its static hosting capabilities for the frontend.

### 7.1. API as Serverless Function
*   The main backend API (originally defined in `server/routes.ts` and configured in `server/index.ts` for local development) is adapted for deployment as a Netlify serverless function.
*   The entry point for this serverless API function is `netlify/functions/api.ts`.
*   This file uses the `serverless-http` library to wrap the core Express application logic, including routes from `server/routes.ts` and authentication setup from `server/auth.ts`, making it compatible with Netlify's serverless function execution environment.
*   Middleware such as `express.json()` and `cors` are applied within this function.
*   Session management using `express-session` is also initialized within this serverless function. It utilizes the `storage.sessionStore` (which is an instance of `MemoryStore` from `memorystore`) for session persistence.
    *   **Note:** As `MemoryStore` is used, sessions are in-memory within the context of each serverless function invocation and are not shared across different invocations or persisted long-term in a durable database. This has significant implications for session reliability in a serverless environment and is suitable mainly for stateless operations or if sessions are managed externally (e.g., JWTs, though this app uses sessions).

### 7.2. WebSocket Handling on Netlify
*   **Important Distinction:** The real-time chat functionality implemented in `server/socketService.ts` (using the `ws` library for persistent WebSocket connections) **does not function in the same real-time manner when deployed to Netlify using the current `netlify/functions/websocket.ts`**.
*   The `netlify/functions/websocket.ts` file acts as a standard HTTP-triggered serverless function. It does not establish or maintain persistent WebSocket connections.
*   Its current behavior is to:
    *   Expose an HTTP endpoint that accepts `POST` requests.
    *   Process JSON payloads to simulate WebSocket-like actions, such as:
        *   Storing chat messages in the database (`storage.createChatMessage`) if the message `type` is `chatMessage`.
        *   Handling requests to "join" or "leave" rooms by calling respective storage methods (`storage.joinChatRoom`, `storage.leaveChatRoom`).
*   **This is not a true WebSocket server.** It simulates some chat operations via HTTP requests but lacks the persistent, bidirectional communication capabilities of the local WebSocket server.
*   **Implication for Laravel Migration:** If real-time, low-latency chat is a critical feature, the current Netlify deployment strategy for WebSockets is insufficient. The Laravel migration team will need to consider:
    *   Utilizing Netlify's specific WebSocket features if available and suitable.
    *   Integrating a third-party managed WebSocket service (e.g., Pusher, Ably, AWS API Gateway with WebSockets).
    *   Deploying a separate, stateful WebSocket server alongside the Laravel application.

### 7.3. `netlify.toml` (Configuration File)
*   While the content of `netlify.toml` was not directly inspected, this file is standard for Netlify deployments and typically configures:
    *   **Build Settings:** Commands to build the frontend application (e.g., `npm run build` in the `client/` directory).
    *   **Publish Directory:** The directory containing the static frontend assets to be deployed (e.g., `client/dist`).
    *   **Functions Directory:** The directory where Netlify discovers serverless functions, which would be `netlify/functions/` or a custom path specified.
    *   **Redirects and Rewrites:** Rules for routing, including potentially rewriting paths like `/api/*` to the `api` serverless function.
    *   **Environment Variables:** Although sensitive values are usually set in the Netlify UI, the TOML file might reference them or define non-sensitive build-time variables.

### 7.4. Frontend Deployment
*   Netlify is well-suited for deploying static frontend applications.
*   The frontend part of this application (presumably located in a `client/` directory) would be built into static HTML, CSS, and JavaScript files.
*   Netlify then deploys these assets from the specified publish directory (e.g., `client/dist`), making them available globally via its CDN.
