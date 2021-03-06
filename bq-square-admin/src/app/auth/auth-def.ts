const TOP = {
  id: "top",
  path: /^\/$/,
  href: '/'
};

const SQUARE = {
  id: "square",
  path: /^\/square.*$/,
  href: '/square'
};

const DATA_SOURCE = {
  id: "data_source",
  name: "Data Source",
  path: /^\/admin\/data_source.*/,
  href: '/admin/data_source'
};

const QUERY = {
    id: "query",
    name: "Query",
  path: /^\/admin\/query.*/,
  href: '/admin/query'
  };

const REPORT = {
  id: "report",
  name: "Report",
  path: /^\/admin\/report.*/,
  href: '/admin/report'
};

const GLOBAL_KEY_VALUE = {
  id: "global_key_value",
  name: "GlobalKeyValue",
  path: /^\/admin\/global_key_value.*/,
  href: '/admin/global_key_value'
};

const USER = {
  id: "user",
  name: "User",
  path: /^\/admin\/user.*/,
  href: '/admin/user'
};

const access_authorizations = {
  "owner": [
    DATA_SOURCE,
    QUERY,
    REPORT,
    GLOBAL_KEY_VALUE,
    USER
  ],
  "admin": [
    DATA_SOURCE,
    QUERY,
    REPORT,
    GLOBAL_KEY_VALUE,
    USER
  ],
  // "editor": [
  //   QUERY,
  //   REPORT
  // ],
  "viewer": [],
  "view_admin": [],
  "all": [
    TOP,
    SQUARE
  ]
};



export function _getNavbar(role) {
  return access_authorizations[role] || []
}

export function _authenticatePath(role, path) {
  let my_access_authorizations =
    [...access_authorizations[role], ...access_authorizations['all']] || [];

  for (let p of my_access_authorizations) {
    if (p.path.test(path)) return true
  }
  return false
}
