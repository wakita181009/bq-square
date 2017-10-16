const TOP = {
  id: "top",
  href: "/"
};

const QUERY = {
    id: "query",
    name: "Query",
    href: "/admin/query"
  };

const REPORT = {
  id: "report",
  name: "Report",
  href: "/admin/report"
};

const KEY_VALUE = {
  id: "key_value",
  name: "GlobalKeyValue",
  href: "/admin/key_value"
};

const USER = {
  id: "user",
  name: "User",
  href: "/admin/user"
};

const access_authorizations = {
  "owner": [
    QUERY,
    REPORT,
    KEY_VALUE,
    USER
  ],
  "admin": [
    QUERY,
    REPORT,
    KEY_VALUE,
    USER
  ],
  // "editor": [
  //   QUERY,
  //   REPORT
  // ],
  "viewer": [],
  "all": [
    TOP
  ]
};



export function _getNavbar(role) {
  return access_authorizations[role] || []
}

export function _authenticatePath(role, path) {
  let my_access_authorizations =
    [...access_authorizations[role], ...access_authorizations['all']] || [];
  for (let p of my_access_authorizations) {
    if (path.indexOf(p.href) === 0) return true
  }
  return false
}
