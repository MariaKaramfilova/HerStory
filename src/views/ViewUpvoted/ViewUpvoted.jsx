import React from "react";
import { Card, Image } from "react-bootstrap";
import { getUserByUsername } from "../../services/users.services";
import { useEffect, useState } from "react";
export default function ViewUpvoted({ upvotedBy }) {
  return (
    <Card>
      <Card.Header style={{ textAlign: "center", fontSize: "40px" }}>
        Upvoted By
      </Card.Header>
      <Card.Body>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {upvotedBy.length > 0 ? (
            upvotedBy.map((person) => (
              <li
                key={crypto.randomUUID()}
                style={{
                  fontSize: "30px",
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Image
                  src="https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png"
                  alt="Profile Picture"
                  roundedCircle
                  width={60}
                  height={60}
                  style={{ marginRight: "10px" }}
                />
                {person}
              </li>
            ))
          ) : (
            <li style={{ fontSize: "20px" }}>
              There are no upvotes for this post yet!
            </li>
          )}
        </ul>
      </Card.Body>
    </Card>
  );
}
