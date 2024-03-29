export interface Track {
  isrc: string;
  xid: number;
  title: string;
  displayArtist: string;
  createdAt: "2020-04-04T09:03:30.65371";
  updatedAt: "2020-06-09T17:20:15.577822";
  releaseYear: 2020;
  speed: "Ballad" | "Uptempo" | "Extra Fast" | "Normal" | "Relaxed";
  energy: "Normal" | "Chill" | "Powerful" | "Easy" | "Extra Powerful";
  languages: Language[];
  origin: Origin;
  parentalWarning: ParentalWarning;
  mood: "Happy" | "Normal" | "Uplifting" | "Sad" | "Melancholic";
  visions: Vision[];
  versions: Version[];
  explicit: Array<"Language" | "Violence" | "Sex" | "Drugs" | "Discrimination">;
  category: "Music Video";
  urgency: Urgency;
  genres: GenreType[];
  subGenres: SubGenre[];
  assetType: AssetType;
  artists: ArtistData[];
  musicTags: string[];
  videoTags: string[];
  id: number;
  version: number;
}

export interface ArtistData {
  id: number;
  role: "Main";
  artistType: "Person";
  artist: Artist;
}

export interface Artist {
  id: number;
  name: string;
}

export type Playlist = {
  id: number;
  name: string;
  tracks: PlaylistTrack[];
  createdAt: string;
};

export type PlaylistTrack = { track: Track; addedAt: string };

export type Genre = {
  id: number;
  name: GenreType | SubGenre;
  type: "Genre" | "Sub genre";
};

export type Entity = Track | Artist | Playlist | Genre;
export type EntityType = "track" | "artist" | "playlist" | "genre";

export type InspectableItem = {
  type: EntityType;
  id: number;
  displayName: string;
};

export type InspectedItems = Array<InspectableItem>;

export type Listable = EntityType | "track-abbreviated";

type Language =
  | "English"
  | "Spanish / Castilian"
  | "Dutch"
  | "Italian"
  | "German"
  | "Portuguese"
  | "French"
  | "Russian"
  | "Japanese"
  | "Yoruba"
  | "Korean"
  | "Chinese"
  | "Hindi"
  | "Thai"
  | "Bengali / Bangla"
  | "Afrikaans"
  | "Zulu"
  | "Czech"
  | "Galician"
  | "Turkish"
  | "Danish"
  | "Romanian (Moldavian / Moldovan)"
  | "Swedish";

type Origin =
  | "GB"
  | "AU"
  | "MX"
  | "CA"
  | "US"
  | "DE"
  | "NZ"
  | "ES"
  | "NL"
  | "IN"
  | "IT"
  | "AT"
  | "RO"
  | "LT"
  | "ZA"
  | "UA"
  | "IS"
  | "GR"
  | "CN"
  | "FR"
  | "DK"
  | "JP"
  | "HU"
  | "undefined"
  | "NO"
  | "RU"
  | "BR"
  | "CO"
  | "SE"
  | "LB"
  | "SY"
  | "KR"
  | "DO"
  | "FI"
  | "AR"
  | "PL"
  | "PR"
  | "RS"
  | "BG"
  | "CH"
  | "IE"
  | "VE"
  | "PA"
  | "NG"
  | "JM"
  | "BE"
  | "CL"
  | "MY"
  | "PT"
  | "HK"
  | "TW"
  | "UNKNOWN"
  | "DZ"
  | "GH"
  | "UY"
  | "UG"
  | "IL"
  | "IR"
  | "TH"
  | "BD"
  | "HR"
  | "CZ"
  | "SI"
  | "AO"
  | "SK"
  | "CU"
  | "MC"
  | "MD"
  | "BB"
  | "PE"
  | "SO"
  | "CR"
  | "EE"
  | "UK";

export type GenreType =
  | "Regional Popular"
  | "Rock"
  | "Pop"
  | "Alternative/Indie"
  | "Rap/Hip-Hop"
  | "Latin"
  | "R&B/Soul"
  | "Hard Rock/Metal"
  | "Country"
  | "Reggae"
  | "Other/Non-Music"
  | "Electronic/Dance"
  | "Classical"
  | "Blues"
  | "Religious/Spiritual"
  | "Holiday"
  | "Jazz"
  | "Soundtracks"
  | "World/Roots"
  | "Folk/Americana"
  | "Children's"
  | "Gospel/Christian";

export type SubGenre =
  | "French Rap/Hip-Hop"
  | "Classic Rock"
  | "Adult Contemporary: Pop"
  | "Synth-Pop"
  | "Indie Pop"
  | "East Coast Rap"
  | "Latin Pop"
  | "Brithop"
  | "Brit Pop"
  | "Alternative Rock"
  | "Southern Hip-Hop"
  | "Indie Folk"
  | "Canto Pop-Rock"
  | "Deutsche Pop"
  | "Schlager"
  | "Funk"
  | "Alternative Metal"
  | "Grunge"
  | "Country General"
  | "Pop General"
  | "Hard Rock"
  | "Pop Punk"
  | "Ranchera"
  | "Rap-Rock"
  | "Reggae General"
  | "Latin Rock"
  | "Other/Non-Music General"
  | "Merengue"
  | "Singer-Songwriter: Pop"
  | "Psychedelic Rock"
  | "Pop Française"
  | "Mainstream Rock"
  | "Trance"
  | "Italian Pop-Rock"
  | "Finnish Pop-Rock"
  | "Teen Pop"
  | "Chinese Pop-Rock"
  | "Thrash Metal"
  | "R&B/Soul General"
  | "Mando Pop-Rock"
  | "Soft Rock"
  | "Rock Française"
  | "Indie Rock"
  | "Regional Popular General"
  | "Electro Pop"
  | "Dance Pop"
  | "Polish Pop-Rock"
  | "J-Pop"
  | "Alternative R&B"
  | "Urban Crossover: R&B"
  | "Industrial Metal"
  | "Adult Contemporary: R&B"
  | "Alternative Singer-Songwriter"
  | "Classical General"
  | "Deutschrock"
  | "Blues Rock"
  | "Glam Rock"
  | "MPB (Música Popular Brasileira)"
  | "Christian Pop"
  | "Reggaetón"
  | "Rap/Hip-Hop General"
  | "Latin Traditional"
  | "Alternative Rap/Hip-Hop"
  | "Pop Rock"
  | "New Wave"
  | "Brazilian Pop-Rock"
  | "Emo Rock"
  | "Ambient Electronic"
  | "Nederhop"
  | "Electronic/Dance General"
  | "Boy Band"
  | "Goth Rock"
  | "West Coast Rap"
  | "Alternative/Indie General"
  | "Trap"
  | "Broadway & Musicals"
  | "Opera"
  | "Post-Hardcore"
  | "Singer-Songwriter: Rock"
  | "Girl Group"
  | "Rock General"
  | "Spoken Word"
  | "Pop Rap"
  | "Progressive Rock"
  | "Contemporary R&B"
  | "Levenslied"
  | "Grime"
  | "Christmas Music"
  | "Euro Dance"
  | "House"
  | "Alternative Pop"
  | "Metalcore"
  | "Latin General"
  | "Samba"
  | "Post-Punk"
  | "Heavy Metal"
  | "Garage Rock"
  | "Latin Rap/Hip-Hop"
  | "Indie Electronic Pop"
  | "Nederpop"
  | "Spanish Hip-Hop"
  | "Neo-Soul"
  | "Gospel"
  | "Ska Punk"
  | "Taiwanese Pop-Rock"
  | "Rockabilly/Early Rock"
  | "Trip Hop/Downtempo"
  | "Japanese Rock"
  | "Indian Pop"
  | "Progressive House"
  | "K-Pop"
  | "Asian Pop-Rock"
  | "Jazz General"
  | "Emo"
  | "Danish Pop-Rock"
  | "Electro House"
  | "Conscious Hip-Hop"
  | "A cappella"
  | "Country Rock"
  | "Salsa"
  | "World/Roots General"
  | "Techno"
  | "Big Band/Swing"
  | "Latin Jazz"
  | "Latin Christmas"
  | "Euro Pop"
  | "Bolero/Balada Romántica"
  | "Disco"
  | "Power Metal"
  | "Classical Crossover"
  | "Afro-Pop"
  | "Variété Française"
  | "Industrial"
  | "Flamenco Pop"
  | "Dancehall"
  | "Pop Reggae"
  | "Art & Experimental"
  | "Folk Rock"
  | "Nu-Disco"
  | "Neo-Psychedelic"
  | "Pop Jazz"
  | "Punk Rock"
  | "Big Room"
  | "Ska"
  | "Italian Pop"
  | "French Touch"
  | "Christian Rock"
  | "Hard Rock/Metal General"
  | "Classic Pop Vocal"
  | "Moombahton Reggaetón"
  | "Blues General"
  | "Urban Crossover: Latin"
  | "Folk Pop"
  | "Latin Folk"
  | "Electronica"
  | "Pagode/Carnaval"
  | "Soundtracks General"
  | "Celtic Music"
  | "Reggae Rock"
  | "Progressive Metal"
  | "Swedish Pop-Rock"
  | "Shoegaze"
  | "Hip-House/Rap House"
  | "Stoner Rock"
  | "Afrobeat"
  | "Death Metal"
  | "EDM"
  | "Symphonic Metal"
  | "Malaysian Pop-Rock"
  | "German Rap/Hip-Hop"
  | "Latin Indie"
  | "Alt Country"
  | "Celtic Rock"
  | "Swiss Pop-Rock"
  | "Gangsta/Hardcore Rap"
  | "Brazilian Funk"
  | "Folk/Americana General"
  | "Pop Soul"
  | "Children's General"
  | "Chanson"
  | "Nu-Metal"
  | "Hardcore Punk"
  | "Mexican Pop-Rock"
  | "Comedy Pop-Rock"
  | "New Age"
  | "Alternative Dance"
  | "Volksmusik"
  | "Holiday General"
  | "Bossa Nova"
  | "Country Pop"
  | "Tech House"
  | "Deep House"
  | "Sertanejo"
  | "Cloud Rap"
  | "Traditional Soul"
  | "Future Bass"
  | "Jazz Funk"
  | "Latin Dance"
  | "Fado"
  | "Breakbeat"
  | "Norwegian Pop-Rock"
  | "Drum & Bass"
  | "Thai Pop-Rock"
  | "Neue Deutsche Härte"
  | "South African Pop-Rock"
  | "Vocal Jazz"
  | "Dream Pop"
  | "Bachata"
  | "Dubstep"
  | "Comedy Rap";

type ParentalWarning =
  | "Explicit"
  | "NotExplicit"
  | "NoAdviceAvailable"
  | "undefined"
  | "Unknown"
  | "ExplicitContentEdited";

type Version =
  | "Normal"
  | "Studio Session"
  | "Live"
  | "Longer Version"
  | "Acoustic"
  | "Shorter Version";

type Urgency =
  | "Recognizable"
  | "Recurrent Hit"
  | "Non-relevant"
  | "Hit"
  | "Classic Hit";

type AssetType =
  | "Official Music Video"
  | "Live Video"
  | "Lyric Video"
  | "Acoustic/Studio Session"
  | "Teaser/Trailer"
  | "Branded/Exclusive"
  | "Partner Content"
  | "Behind The Scenes/Making Of"
  | "Official Audio"
  | "undefined"
  | "Karaoke"
  | "Visualizer"
  | "TV Show/Webseries"
  | "Interview/Commentary/Documentary";

type Vision =
  | "Normal"
  | "Live"
  | "Black & White"
  | "Cartoon"
  | "Babe"
  | "Mature";
