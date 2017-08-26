module.exports = {
    "id": "/Submission",
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "address": {"$ref": "/SimpleAddress"},
        "votes": {"type": "integer", "minimum": 1},

        // state of a submission
        //  preparation, proposed, reviewing, maybe, accepted, rejected
        "state": {"type": "string"},

        // strings for humans; title
        "title": {"type": "string"},
        // strings for humans; short desc (for overview)
        "summary": {"type": "string"},
        // strings for humans; long desc (for full intro/reading material/links/..., markdown)
        "description":  {"type": "string"},
        // strings for humans; speaker bio (incl twitter handle, ..., markdown)
        "speaker_bio": {"type": "string"},

        // email of primary content bringer
        "lead_contact_email": {"type": "string"},
        // associated contacts
        "associated_contacts": {
            "properties": {
                "name_first" : {"type": "string"},
                "name_last" : {"type": "string"},
                "email" : {"type": "string"}
            }
        },
        // audience level indicator
        //  family, advanced, hacker
        "audience_level": {"type": "string"},

        // type of presentation, determines availability of further options
        //  talk lightningtalk workshop game demonstration
        "presentation_type": {"type": "string" },
        // type of attendance
        //  full-time-presence (default for presentation_type==*talk) walk-in-walk-out
        "attendance_type": {"type": "string" },
        // place type (and associated bools)
        //  none (self-provided, aka village)
        //  orga-provided talk room (beamer/chairs) (default for presentation_type==talk)
        //  orga-provided normal room (default for presentation_type==workshop)
        //      need_beamer = true
        //      need_power = true
        //      need_tables = true
        //      need_soldering = false
        //      need_glue_guns = false
        //      need_special_items = string
        //  orga-provided outside place
        //      need_tables = false
        //      need_power = false
        //      need_glue_guns = false
        //      need_special_items = string
        //      (need_soldering UNSELECTABLE)
        //  ...=specific dedicated rooms (Knutselba(a)r, drone field, main stage, parking, ...
        "place_type": {"type": "string" },
        // anything special attendants are to bring themselves
        "required_from_attendants" : {"type": "string"},
        // anything special orga is to provide
        "required_from_orga" : {"type": "string"},

        // time required for content, defaults:
        //  10m for presentation_type==lightningtalk
        //  1h for presentation_type==*
        "required_time_minutes": {"type": "integer", "minimum": 10},
        // time required for one visitor
        //  can be shown if attendance_type=walk_in
        "activity_duration_minutes": {"type": "integer", "minimum": 1},

        // the number of sessions needed
        //  for talks we can default to 1
        //  workshops might need extra sessions to build, conclude, ...
        "sessions_needed": {"type": "integer", "minimum": 1},
        // how many times the content can be repeated in case of great interest
        "max_repeats": {"type": "integer", "minimum": 1},

        // timing
        //  these should all default to normal content hours
        "time_available_friday_start": {"type": "integer"},
        "time_available_friday_stop": {"type": "integer"},
        "time_available_saturday_start": {"type": "integer"},
        "time_available_saturday_stop": {"type": "integer"},
        "time_available_sunday_start": {"type": "integer"},
        "time_available_sunday_stop": {"type": "integer"},

        // in case of presentation_type=workshop, how many people the CB can furnish
        "participant_cap": {"type": "integer", "minimum": 1},

        // size of the group the submitter is intending to bring
        //  so we can have an idea of the number of tickets to dedicate for this content
        "total_group_size": {"type": "integer", "minimum": 1},

        // additional cost, fixed part (if presentation_type==workshop)
        "additional_costs_fixed": {"type": "integer", "minimum": 0},
        // additional cost, per attendant (if presentation_type==workshop)
        "additional_costs_per_attendant": {"type": "integer", "minimum": 0},

        // associated hacker-spaces, freeform
        "associated_hackerspaces": {"type": "string"}
    }
};