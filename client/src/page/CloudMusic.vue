<template>
  <div id="music">
    <Layout />
    <Player />
    <Playlist />
    <ShareReader />
  </div>
</template>
<script>
import Layout from '@/layout/netMusic'

import Playlist from '@/components/playlist'
import Player from '@/components/player'
import ShareReader from '@/components/share-reader'
import { mapMutations } from 'vuex'

export default {
  metaInfo() {
    return {
      title: '欢迎来到sshPlayer',
    }
  },
  created() {
    this.set_headline({
      content: 'Welcome to cloud music',
      animation: 'animated rotateIn',
    })
  },
  methods: {
    ...mapMutations(['set_headline']),
  },
  components: { Layout, Playlist, Player, ShareReader },
}
</script>

<style lang="scss">
#music {
  height: 100%;
  background-color: var(--body-bgcolor);
  font-size: $font-size;
}
</style>
