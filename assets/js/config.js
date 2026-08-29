/* Grading Lab Agency — front-end config.
   ---------------------------------------------------------------------------
   Fill these in with YOUR keys. Everything here is safe to be public.

   Supabase (certificate lookup): use the PUBLIC "anon" key only — never the
   service_role key. The certificates table is locked; the site only calls the
   verify_cert function. See SUPABASE_SETUP.md.

   Contact form: set web3formsKey to send submissions straight to your inbox.
   Get a free key at https://web3forms.com (enter info.gradinglabagency@gmail.com).
   While it is blank, the form opens the visitor's email app instead.
   ------------------------------------------------------------------------- */
window.GLA_CONFIG = {
  // Supabase (publishable key is safe to be public; never put the secret key here)
  supabaseUrl: 'https://lgecsarpfviqvjfvyori.supabase.co',
  supabaseAnonKey: 'sb_publishable_xT8U-WRShUnZEBBnLlmdAQ_1iic0IqQ',
  certRpc: 'verify_cert',

  // Contact form
  web3formsKey: '',                                   // paste your Web3Forms access key
  contactEmail: 'info.gradinglabagency@gmail.com'
};
