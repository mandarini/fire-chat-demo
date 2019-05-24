const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

// Sends a notifications to all users when a new message is posted.
exports.sendNotifications = functions.database
  .ref("/messages/{messageId}")
  .onWrite((change, context) => {
    // Only send a notification when a message has been created.
    if (change.before.val()) {
      return;
    }

    // Notification details.
    const original = change.after.val();
    const text = original.msg;
    const payload = {
      notification: {
        title: `${original.user} posted a message`,
        body: text
          ? text.length <= 100
            ? text
            : text.substring(0, 97) + "..."
          : ""
      }
    };

    // Get the list of device tokens.
    return admin
      .database()
      .ref("fcmTokens")
      .once("value")
      .then(allTokens => {
        if (allTokens.val()) {
          // Listing all tokens.
          const tokens = Object.keys(allTokens.val());

          // Send notifications to all tokens.
          return admin
            .messaging()
            .sendToDevice(tokens, payload)
            .then(response => {
              // For each message check if there was an error.
              const tokensToRemove = [];
              response.results.forEach((result, index) => {
                const error = result.error;
                if (error) {
                  console.error(
                    "Failure sending notification to",
                    tokens[index],
                    error
                  );
                  // Cleanup the tokens who are not registered anymore.
                  if (
                    error.code === "messaging/invalid-registration-token" ||
                    error.code === "messaging/registration-token-not-registered"
                  ) {
                    tokensToRemove.push(
                      allTokens.ref.child(tokens[index]).remove()
                    );
                  }
                }
              });
              return Promise.all(tokensToRemove);
            });
        }
      });
  });
