import { join } from 'path'

export const PROJECT_ROOT_PATH = process.cwd()
export const PUBLIC_FOLDER_NAME = 'public'
export const POSTS_FOLDER_NAME = 'posts'
export const USERS_FOLDER_NAME = 'users'

// 공개폴더 절대 경로
export const PUBLIC_FOLDER_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME)

//포스트 이미지 저장 경로
export const POST_IMAGE_PATH = join(PUBLIC_FOLDER_PATH, POSTS_FOLDER_NAME)

// /public/posts/xxx.jpg
export const POST_PUBLIC_IMAGE_PATH = join(PUBLIC_FOLDER_NAME, POSTS_FOLDER_NAME)
