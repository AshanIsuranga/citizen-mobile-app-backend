const pool = require("../db/pool");

// Find user NIC by user ID
exports.getUserNicDao = async (userId) => {
  const sql = `SELECT nic FROM users WHERE id = $1`;
  const result = await pool.query(sql, [userId]);

  return result.rows[0];
};

// Get all cases for a user
exports.getAllCasesForUser = async (nic) => {
  const sql = `
    SELECT DISTINCT
      u.id AS userId,
      u.fullnameenglish,
      c.id AS caseId,
      c.casenumber,
      c.casetype,
      c.casestatus,
      c.createdat,
      cu.courtnameenglish,
      cu.courtnamesinhala,
      cu.courtnametamil,
      cp.partyrole,
      cp.partystatus,
      cp.partytype

    FROM users u

    LEFT JOIN organization_users ou 
      ON u.nic = ou.organizationusernic

    LEFT JOIN organizations o 
      ON ou.organization_id = o.id

    LEFT JOIN case_parties cp ON (
      (
        cp.partytype = 'Individual'
        AND cp.partynic = u.nic
        AND cp.linkeduserid IS NOT NULL
      )
      OR
      (
        cp.partytype = 'Organization'
        AND cp.organizationid = o.id
        AND ou.linkeduserid IS NOT NULL
      )
    )

    LEFT JOIN cases c 
      ON cp.caseid = c.id

    LEFT JOIN courts cu 
      ON c.courtid = cu.id

    WHERE u.nic = $1
      AND cp.connectionstatus = 'Connected'
      AND cp.partytype IN ('Individual', 'Organization')

    ORDER BY c.createdat DESC;
  `;

  const result = await pool.query(sql, [nic]);

  return result.rows;
};

exports.getSelectedCase = async (caseId) => {
  const sql = `
        select c.casenumber, c.casetype, c.casestatus, c.createdat, cu.courtnameenglish, cu.courtnamesinhala, cu.courtnametamil, c."descriptionEnglish", c."descriptionSinhala", c."descriptionTamil", c."closeNoteEnglish", c."closeNoteSinhala", c."closeNoteTamil",
        c.closereason, c.closuredate, cu.address, cu.city, cu.district, cu.province, cu.phonenumber01
        from cases c 
        left join courts cu on c.courtid  = cu.id 
        where c.id = $1
  `;

  const result = await pool.query(sql, [caseId]);

  return result.rows;
};