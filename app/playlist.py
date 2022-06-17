from datetime import datetime
import spotipy
from spotipy.oauth2 import SpotifyOAuth


# Maximum playlist size allowed by Spotify
MAX_LENGTH = 10000


class Playlist:

    def __init__(self, spotify, playlist={}):
        self.spotify = spotify

        self.user_id = spotify.current_user()['id']
        self.playlist_ids = playlist['playlistIds'] if 'playlistIds' in playlist else None
        self.artists = playlist['artists'] if 'artists' in playlist else None


    def generate(self):
        # Get all artists, albums, and tracks
        artists = get_followed_artists(self.spotify)
        all_tracks = get_tracks_by_artists(artists[3:4])

        ids = []
        count = 0
        while count * MAX_LENGTH < len(all_tracks):

            # Limit playlist size to 10,000
            start = count * MAX_LENGTH
            end = count * MAX_LENGTH + MAX_LENGTH
            tracks = all_tracks[start:end]

            # Create new playlist and add tracks
            playlist = self.spotify.user_playlist_create(
                self.user_id,
                f"Everything - {f'({count})' if count > 0 else ''}" + datetime.now().strftime('%m/%d/%Y'),
                public=False,
                collaborative=False,
                description='Created on ' + datetime.now().strftime('%m/%d/%Y, %H:%M:%S') + ' by autofy')

            track_ids = list(map(lambda track: track['uri'], tracks))
            offset = 0
            while offset + 50 < len(track_ids):
                self.spotify.playlist_add_items(playlist_id=playlist['id'], items=track_ids[offset:offset + 50])
                offset = offset + 50

            if len(track_ids) > 0:
                self.spotify.playlist_add_items(playlist_id=playlist['id'], items=track_ids[offset:])

            ids.append(playlist['id'])

            count += 1

        # return {
        #     'userId': self.user_id,
        #     'playlistIds': ids,
        #     'artists': list(map(lambda artist: artist['id'], artists)),
        #     'updatedAt': datetime.now()
        # }

    def get_object(self):
        return {
            'userId': self.user_id,
            'playlistIds': self.playlist_ids,
            'artists': self.artists
        }



def get_ids(l):
    return list(map(lambda i: i['uri'], l))



def generate_playlist(spotify):
    # Get all artists, albums, and tracks
    artists = get_followed_artists(spotify)
    all_tracks = get_tracks_by_artists(artists)


    ids = []
    count = 0
    while count * MAX_LENGTH < len(all_tracks):

        # Limit playlist size to 10,000
        start = count * MAX_LENGTH
        end = count * MAX_LENGTH + MAX_LENGTH
        tracks = all_tracks[start:end]


        # Create new playlist and add tracks
        playlist = spotify.user_playlist_create(
            spotify.me()['id'],
            f"Everything - {f'({count})' if count > 0 else ''}" + datetime.now().strftime('%m/%d/%Y'),
            public=False,
            collaborative=False,
            description='Created on ' + datetime.now().strftime('%m/%d/%Y, %H:%M:%S') + ' by autofy')

        track_ids = list(map(lambda track: track['uri'], tracks))
        offset = 0
        while offset + 50 < len(track_ids):
            spotify.playlist_add_items(playlist_id=playlist['id'], items=track_ids[offset:offset + 50])
            offset = offset + 50

        if len(track_ids) > 0:
            spotify.playlist_add_items(playlist_id=playlist['id'], items=track_ids[offset:])

        ids.append(playlist['id'])


        count += 1


    return {
        'userId': spotify.current_user()['id'],
        'playlistIds': ids,
        'artists': list(map(lambda artist: artist['id'], artists)),
        'updatedAt': datetime.now()
    }


def update_playlist(playlist, spotify):
    followed_artists = list(map(lambda artist: artist['id'], get_followed_artists(spotify)))

    # Get unfollowed artists
    # unfollowed_since = list(set(playlist['artists']) - set(followed_artists))
    # if unfollowed_since:
    #     tracks = get_tracks_by_artists(unfollowed_since, spotify)
    #     print('removed tracks')
        # Remove their tracks

    # Get followed artists
    followed_since = list(set(followed_artists) - set(playlist['artists']))
    if followed_since:
        tracks = get_tracks_by_artists(followed_since, spotify)
        add_tracks_to_playlist(playlist, spotify)
        # Add their tracks

    # Update artists in playlist
    # Update updatedAt time
    pass


def add_tracks_to_playlist(tracks, playlist, spotify):
    playlist_ids = playlist['playlistIds'].reverse()

    while len(tracks) > 0:

        # Get next available playlist, or create a new one
        if len(playlist_ids) > 0:
            playlist_capacity = MAX_LENGTH - spotify.playlist(playlist_id=playlist_ids.pop())['tracks']['total']
        else:
            count = len(playlist['playlistIds'])
            playlist = spotify.user_playlist_create(
                spotify.me()['id'],
                f"Everything - {f'({count})' if count > 0 else ''}" + datetime.now().strftime('%m/%d/%Y'),
                public=False,
                collaborative=False,
                description='Created on ' + datetime.now().strftime('%m/%d/%Y, %H:%M:%S') + ' by autofy')

            playlist_capacity = MAX_LENGTH
            playlist['playlistIds'].append(playlist['id'])


        # Add tracks to playlist
        track_ids = list(map(lambda track: track['uri'], tracks[:playlist_capacity]))

        while track_ids:
            spotify.playlist_add_items(playlist_id=playlist['id'], items=track_ids[:50])
            track_ids = track_ids[50:]



        # Remove added tracks from list
        tracks = tracks[playlist_capacity:]


    return playlist


def remove_tracks_from_playlist(tracks, playlist, spotify):
    track_ids = list(map(lambda track: track['uri'], tracks))

    for playlist_id in playlist['playlistIds']:
        # Get all tracks for playlist
        # Get the unions of those tracks and tracks to delete
        # Delete the tracks
        while track_ids:
            spotify.playlist_add_items(playlist_id=playlist['id'], items=track_ids[:50])
            track_ids = track_ids[50:]


        # If playlist is empty, delete playlist
        if spotify.playlist(playlist_id=playlist_id)['tracks']['total'] <= 0:
            # TODO: Delete playlist from spotify
            playlist['playlistIds'].remove(playlist_id)

    pass


def get_tracks_by_artists(artist_ids, spotify):
    albums = []
    for artist_id in artist_ids:
        albums.extend(get_albums(artist_id, spotify))
    print_names(albums)

    tracks = []
    for album in albums:
        tracks.extend(get_tracks(album['id'], spotify))
    print()
    print(len(tracks), 'tracks')

    return tracks




# # Get all artists user follows
# def get_followed_artists(spotify):
#     artists = []
#     prev_artist = None
#     while True:
#         results = spotify.current_user_followed_artists(after=prev_artist)['artists']['items']
#
#         if len(results) == 0: break
#
#         artists.extend(results)
#         prev_artist = results[-1]['id']
#
#     return artists
#
#
# def get_artist_albums(artist_id, spotify):
#     albums = []
#     offset = 0
#     while True:
#         results = spotify.artist_albums(artist_id, album_type='album', country='US', offset=offset)['items']
#
#         if len(results) == 0: break
#
#         albums.extend(results)
#         offset = offset + 20
#
#     return albums
#
#
# def get_artists_albums(artists, spotify):
#     albums = []
#     for artist in artists:
#         albums.extend(get_artist_albums(artist['id'], spotify))
#
#     return albums
#
#
# def get_album_tracks(album_id, spotify):
#     tracks = []
#     offset = 0
#     while True:
#         results = spotify.album_tracks(album_id, offset=offset)['items']
#
#         if len(results) == 0: break
#
#         tracks.extend(results)
#         offset = offset + 50
#
#     return tracks
#
#
# def get_albums_tracks(albums, spotify):
#     tracks = []
#     for album in albums:
#         tracks.extend(get_album_tracks(album['id'], spotify))
#
#     return tracks

def print_names(arr):
    print('\n\n\n')
    for i, item in enumerate(arr):
        print(i + 1, item['name'])




# # Settings for generating a playlist
#
# # Sort tacks...
# #   alphabetically
# #   by artist
# #   oldest to newest
# #   newest to oldest
# #   least to most popular -- not possible
# #   most to least popular -- not possible
#
# # Automatically update
# #   when artists release new music
# #   when i follow artist
# #   when i unfollow artist
# def generate_playlist(spotify, sort_tracks=None, update=None):
#     # Get all artists, albums, and tracks
#     artists = get_followed_artists(spotify)
#
#     if sort_tracks == SORT['ARTIST']:
#         artists = sorted(artists, key=lambda artist: artist['name'].casefold())
#
#     print_names(artists)
#
#     albums = get_artists_albums(artists[4:5], spotify)
#
#     # If sort by date, sort list of albums by release date
#     if sort_tracks == SORT['RELEASE']:
#         albums = sorted(albums, key=lambda album: album['release_date'])
#     elif sort_tracks == SORT['RELEASE_REVERSE']:
#         albums = sorted(albums, key=lambda album: album['release_date'], reverse=True)
#
#     print_names(albums)
#
#
#     tracks = get_albums_tracks(albums, spotify)
#
#     if sort_tracks == SORT['ALPHA']:
#         tracks = sorted(tracks, key=lambda track: track['name'].casefold())
#
#     print_names(tracks)
#
#     # Create new playlist and add tracks
#     playlist = spotify.user_playlist_create(spotify.me()['id'], 'Everything - ' + datetime.now().strftime("%m/%d/%Y"), public=False, collaborative=False, description='Created on ' + datetime.now().strftime("%m/%d/%Y, %H:%M:%S") + ' by Autofy')
#
#     # TODO: Limit playlist size to 10,000 tracks
#
#     track_ids = list(map(lambda track: track['uri'], tracks))
#     offset = 0
#     while offset + 50 < len(track_ids):
#         spotify.playlist_add_items(playlist_id=playlist['id'], items=track_ids[offset:offset + 50])
#         offset = offset + 50
#     else:
#         if len(track_ids) > 0:
#             spotify.playlist_add_items(playlist_id=playlist['id'], items=track_ids[offset:])
#
#     return playlist['id']
#
#
#
# if __name__ == '__main__':
#     # Set up Spotify
#     scope = "user-follow-read playlist-modify-private"
#     sp = spotipy.Spotify(auth_manager=SpotifyOAuth(scope=scope))
#     generate_playlist(sp)
#
#
#
#
#
#


















### NEW SECTION #############################################################################################




















def get_followed_artists(spotify):
    artists = []
    prev_artist = None


    while True:
        results = spotify.current_user_followed_artists(after=prev_artist)['artists']['items']

        if len(results) == 0: break

        artists.extend(results)
        prev_artist = results[-1]['id']

    return artists












def get_albums(artist_id, spotify):
    albums = []
    offset = 0

    while True:
        results = spotify.artist_albums(
            artist_id,
            album_type='album',
            country='US',
            offset=offset
        )['items']

        if len(results) == 0: break

        albums.extend(results)
        offset = offset + 20

    return albums


def get_tracks(album_id, spotify):
    tracks = []
    offset = 0
    while True:
        results = spotify.album_tracks(album_id, offset=offset)['items']

        if len(results) == 0: break

        tracks.extend(results)
        offset = offset + 50

    return tracks


# def get_tracks_since(artist_ids, date, spotify):
#
#     albums = []
#
#     # For each artist, get list up albums posted since date
#     for artist_id in artist_ids:
#         offset = 0
#         while True:
#             # TODO: Add check to only get albums since date
#             results = spotify.artist_albums(artist_id, album_type='album', country='US', offset=offset)['items']
#
#             if len(results) == 0: break
#
#             albums.extend(results)
#             offset = offset + 20
#
#
#     # Get tracks in albums
#     return get_albums_tracks(albums, spotify)






# playlist = {
#   userId
#   playlistIds: []
#   updatedAt
#   settings: {
#     artists: []
#     sortingOrder
#     updateWhen: []?
#   }
# }
# def update_playlist(playlist, spotify):
#     tracks_to_add = tracks_to_remove = []
#
#     artists_followed = list(map(lambda artist: artist['uri'], get_followed_artists(spotify)))
#
#     # Check what needs to be updated
#     update = playlist.settings.updateWhen
#     artists_in_playlist = playlist.settings.artists
#     lastUpdated = playlist.updatedAt
#
#     if UPDATE['ARTIST_POSTS'] in update:
#         new_tracks = get_tracks_since(artists_in_playlist, lastUpdated, spotify)
#         tracks_to_add.extend(new_tracks)
#
#     if UPDATE['USER_FOLLOWS'] in update:
#         artists_followed = artists_followed - artists_in_playlist
#         for artist in artists_followed:
#
#             pass
#         #   Add to list of tracks to be added
#         # Add artists to list of artists
#         pass
#
#     if UPDATE['USER_UNFOLLOWS'] in update:
#         artists_unfollowed = artists_in_playlist - artists_followed
#         for artist in artists_unfollowed:
#             # Get all tracks
#             pass
#         #   Add to list of tracks to be removed
#         # Remove artists from list of artists
#         pass
#
#     # Remove appropriate tracks
#     # Add new tracks in sorting order
#     # Reorganize playlists into lengths of 10,000 tracks
#
#
#
#     pass