package model

type PersonalInfo struct {
	FirstName string `json:"firstName,omitempty" bson:"firstName,omitempty"`
	LastName  string `json:"lastName,omitempty" bson:"lastName,omitempty"`
}

type SecurityInfo struct {
	Password           string `json:"password" bson:"password"`
	AuthorizationToken string `json:"authorizationToken,omitempty" bson:"authorizationToken,omitempty"`
	TOTP               string `json:"totp,omitempty" bson:"totp,omitempty"`
}

type User struct {
	UUID       string       `json:"uuid,omitempty" bson:"uuid,omitempty"`
	CreatedAt  int64        `json:"createdAt,omitempty" bson:"createdAt,omitempty"`
	Mail       string       `json:"mail" bson:"mail"`
	Personal   PersonalInfo `json:"personal,omitempty" bson:"personal,omitempty"`
	Security   SecurityInfo `json:"security" bson:"security"`
	AvatarSeed string       `json:"avatarSeed,omitempty" bson:"avatarSeed,omitempty"`
}

func (u *User) SetDefaults() {
	defaults := map[*string]string{
		&u.Personal.FirstName: "null",
		&u.Personal.LastName:  "null",
		&u.Security.TOTP:      "null",
		&u.AvatarSeed:         "null",
	}

	for field, value := range defaults {
		if *field == "" {
			*field = value
		}
	}
}
