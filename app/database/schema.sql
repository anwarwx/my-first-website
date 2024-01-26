CREATE TABLE contact (
  contact_id      INTEGER   NOT NULL  AUTO_INCREMENT,
  contact_name    TEXT      NOT NULL,
  contact_email   TEXT      NOT NULL,
  contact_date    TEXT, 
  browser_choice  TEXT,
  is_subscribed   TEXT,
  PRIMARY KEY(contact_id)
);

CREATE TABLE sale (
  sale_id       INTEGER   NOT NULL  AUTO_INCREMENT,
  sale_message  TEXT      NOT NULL,
  start_time    DATETIME  NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  end_time      DATETIME,
  PRIMARY KEY(sale_id)
);
